// src/serverless.ts
import 'tsconfig-paths/register';
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';

import express from 'express';
import { join } from 'path';
import helmet from 'helmet';
import compression from 'compression';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let cachedApp: any = null;

// ----------------------------------------------------------------------
// 🚀 MAIN SERVERLESS HANDLER
// ----------------------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!cachedApp) {
    const server = express();

    const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(server),
    );

    const configService = app.get(ConfigService);
    const nodeEnv = configService.get('NODE_ENV');
    const backendUrl =
      configService.get('BACKEND_URL') || 'https://your-project.vercel.app';

    // ----------------------------------------------------------------------
    // CORS
    // ----------------------------------------------------------------------
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    // ----------------------------------------------------------------------
    // Helmet CSP + Security
    // ----------------------------------------------------------------------
    app.use(
      helmet({
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false,
        contentSecurityPolicy:
          nodeEnv === 'development'
            ? {
                directives: {
                  defaultSrc: ["'self'"],
                  scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    'https://cdn.jsdelivr.net',
                    'https://cdnjs.cloudflare.com',
                    'https://js.stripe.com',
                  ],
                  styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    'https://fonts.googleapis.com',
                    'https://cdn.jsdelivr.net',
                    'https://cdn.datatables.net',
                  ],
                  fontSrc: [
                    "'self'",
                    'data:',
                    'https://fonts.gstatic.com',
                    'https://cdnjs.cloudflare.com',
                  ],
                  imgSrc: [
                    "'self'",
                    'data:',
                    'blob:',
                    'https:',
                    'http:',
                    backendUrl,
                  ],
                  connectSrc: [
                    "'self'",
                    'ws:',
                    'wss:',
                    'https://api.openai.com',
                    'https://api.stripe.com',
                    'https://cdn.jsdelivr.net',
                  ],
                  frameSrc: [
                    "'self'",
                    'https://js.stripe.com',
                    'https://hooks.stripe.com',
                  ],
                  mediaSrc: ["'self'", 'blob:'],
                  objectSrc: ["'none'"],
                },
              }
            : false,
      }),
    );

    // ----------------------------------------------------------------------
    // Permissions Policy
    // ----------------------------------------------------------------------
    app.use((_req, res, next) => {
      res.setHeader(
        'Permissions-Policy',
        [
          'accelerometer=()',
          'camera=()',
          'geolocation=(self)',
          'gyroscope=()',
          'magnetometer=()',
          'microphone=()',
          'payment=()',
          'usb=()',
          'fullscreen=(self)',
        ].join(', '),
      );
      next();
    });

    // ----------------------------------------------------------------------
    // Compression
    // ----------------------------------------------------------------------
    app.use(compression());

    // ----------------------------------------------------------------------
    // API PREFIX + VERSIONING
    // ----------------------------------------------------------------------
    app.setGlobalPrefix('/api');
    app.enableVersioning();

    // ----------------------------------------------------------------------
    // Static Files
    // ----------------------------------------------------------------------
    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));

    // ----------------------------------------------------------------------
    // 🔥 SWAGGER (ONLY DEV MODE)
    // ----------------------------------------------------------------------
    if (nodeEnv === 'development') {
      const createSwaggerConfig = (title: string, description: string) =>
        new DocumentBuilder()
          .setOpenAPIVersion('3.1.0')
          .setTitle(title)
          .setDescription(description)
          .setVersion('1.0')
          .addBearerAuth()
          .addServer(backendUrl)
          .build();

      const customCss = `
        .swagger-ui .topbar {
          background-color: #1e293b;
          border-bottom: 2px solid #0ea5e9;
        }
      `;

      // ADMIN API DOC
      const adminSwaggerConfig = createSwaggerConfig(
        `${configService.get('PROJECT_NAME')} Admin API`,
        `Admin API documentation`
      );

      const userSwaggerConfig = createSwaggerConfig(
        `${configService.get('PROJECT_NAME')} User API`,
        `User API documentation`
      );

      const adminDoc = SwaggerModule.createDocument(app, adminSwaggerConfig);
      const userDoc = SwaggerModule.createDocument(app, userSwaggerConfig);

      SwaggerModule.setup(
        'apidoc/v1',
        app,
        adminDoc,
        {
          customCss,
          swaggerOptions: { defaultModelsExpandDepth: -1 },
          jsonDocumentUrl: 'apidoc/v1/openapi.json',
        },
      );

      SwaggerModule.setup(
        'apidoc/v1/user',
        app,
        userDoc,
        {
          customCss,
          swaggerOptions: { defaultModelsExpandDepth: -1 },
          jsonDocumentUrl: 'apidoc/v1/user/openapi.json',
        },
      );
    }

    // ----------------------------------------------------------------------
    // GLOBAL ERROR HANDLER
    // ----------------------------------------------------------------------
    app.use((err, req, res, next) => {
      if (res.headersSent) return next(err);

      const isApi = req.path.startsWith('/api');
      res.status(err.status || 500);

      return isApi
        ? res.json({ message: err.message || 'Internal Server Error' })
        : res.type('html').send('<h1>Something went wrong</h1>');
    });

    await app.init();
    cachedApp = server;

    console.log(
      '🚀 Serverless bootstrap:',
      `[${nodeEnv?.toUpperCase()}]`,
      '| Node:',
      process.version,
    );
  }

  // Return server promise
  return new Promise<void>((resolve) => {
    cachedApp(req, res, resolve);
  });
}
