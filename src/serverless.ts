// src/serverless.ts
import 'tsconfig-paths/register';
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';

import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let cachedServer: any = null;

// ----------------------------------------------------------------------
// 🚀 MAIN SERVERLESS HANDLER
// ----------------------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!cachedServer) {
      const expressApp = express();

      const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        new ExpressAdapter(expressApp),
        { logger: ['error', 'warn'] }
      );

      const configService = app.get(ConfigService);
      const backendUrl = configService.get<string>('BACKEND_URL');
      const nodeEnv = configService.get('NODE_ENV');

      // ----------------------------------------------------------------------
      // CORS
      // ----------------------------------------------------------------------
      app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      });

      // ----------------------------------------------------------------------
      // Helmet (CSP Disabled for Stripe + Vercel)
      // ----------------------------------------------------------------------
      app.use(
        helmet({
          contentSecurityPolicy: false,
          crossOriginEmbedderPolicy: false,
          crossOriginResourcePolicy: false,
        }),
      );

      // ----------------------------------------------------------------------
      // Compression
      // ----------------------------------------------------------------------
      app.use(compression());

      // ----------------------------------------------------------------------
      // Global Prefix
      // ----------------------------------------------------------------------
      app.setGlobalPrefix('api');
      app.enableVersioning();

      // ----------------------------------------------------------------------
      // 🚀 Swagger
      // ----------------------------------------------------------------------
      const createSwaggerConfig = (title: string, desc: string) =>
        new DocumentBuilder()
          .setOpenAPIVersion('3.1.0')
          .setTitle(title)
          .setDescription(desc)
          .setVersion('1.0')
          .addBearerAuth()
          .addServer(backendUrl)
          .build();

      const adminSwaggerConfig = createSwaggerConfig(
        `${configService.get('PROJECT_NAME')} Admin API`,
        'Admin API documentation'
      );

      const userSwaggerConfig = createSwaggerConfig(
        `${configService.get('PROJECT_NAME')} User API`,
        'User API documentation'
      );

      const adminDoc = SwaggerModule.createDocument(app, adminSwaggerConfig);
      const userDoc = SwaggerModule.createDocument(app, userSwaggerConfig);

      SwaggerModule.setup('apidoc/v1', app, adminDoc);
      SwaggerModule.setup('apidoc/v1/user', app, userDoc);

      // ----------------------------------------------------------------------
      // Global Error Handler
      // ----------------------------------------------------------------------
      app.use((err, _req, res, _next) => {
        res.status(err.status || 500).json({
          message: err.message || 'Internal Server Error',
        });
      });

      await app.init();

      cachedServer = expressApp;

      console.log(
        `🚀 NestJS Serverless Loaded (${nodeEnv}) | Node: ${process.version}`
      );
    }

    return cachedServer(req, res);
  } catch (error) {
    console.error('❌ Serverless Handler Error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
}
