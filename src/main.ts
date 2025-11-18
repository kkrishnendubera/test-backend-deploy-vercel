// import { Logger } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { ConfigService } from '@nestjs/config';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import helmet from 'helmet';
// import compression from 'compression';
// import { resolve } from 'path';

// import { AppModule } from './app.module';
// import { ApiValidationPipe } from './common/pipes/validation.pipe';
// import { CustomExceptionFilter } from './common/filters/exception.filter';
// import { ResponseInterceptor } from './common/interceptors/response.interceptor';
// import { defaultUserCreate } from './migrate';

// async function bootstrap() {
//   const env = process.env.NODE_ENV || 'development';
//   console.info(
//     '\x1b[36m%s\x1b[0m',
//     '🚀 Bootstrap:',
//     `Starting application in [${env.toUpperCase()}] mode`,
//   );
//   console.info('\x1b[32m%s\x1b[0m', '🔧 Node Version:', process.version);

//   const app = await NestFactory.create<NestExpressApplication>(AppModule);
//   const configService = app.get(ConfigService);
//   const logger = app.get(Logger);

//   // Enable CORS
//   app.enableCors({
//     origin: '*',
//     methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//     credentials: true,
//   });

//   // Compression
//   app.use(compression());




//   // Helmet security headers (CSP included)
//   const backendUrl = configService.get('BACKEND_URL') || 'http://localhost:3000';
//   app.use(
//     helmet({
//       crossOriginEmbedderPolicy: false,
//       crossOriginResourcePolicy: false,
//       contentSecurityPolicy:
//         configService.get('NODE_ENV') === 'development'
//           ? {
//               directives: {
//                 defaultSrc: ["'self'"],
//                 scriptSrc: [
//                   "'self'",
//                   "'unsafe-inline'",
//                   'https://cdn.jsdelivr.net',
//                   'https://cdnjs.cloudflare.com',
//                   'https://js.stripe.com',
//                 ],
//                 styleSrc: [
//                   "'self'",
//                   "'unsafe-inline'",
//                   'https://fonts.googleapis.com',
//                   'https://cdn.jsdelivr.net',
//                   'https://cdn.datatables.net',
//                 ],
//                 fontSrc: [
//                   "'self'",
//                   'data:',
//                   'https://fonts.gstatic.com',
//                   'https://cdnjs.cloudflare.com',
//                 ],
//                 imgSrc: [
//                   "'self'",
//                   'data:',
//                   'blob:',
//                   'https:',
//                   'http:',
//                   `${backendUrl}`,
//                 ],
//                 connectSrc: [
//                   "'self'",
//                   'wss:',
//                   'ws:',
//                   'blob:',
//                   'https://cdnjs.cloudflare.com',
//                   'https://cdn.quilljs.com',
//                   'https://cdn.jsdelivr.net',
//                   'https://cdn.datatables.net',
//                   'https://*.tile.osm.org',
//                   'https://api.openai.com',
//                   'https://api.stripe.com',
//                 ],
//                 frameSrc: [
//                   "'self'",
//                   'https://js.stripe.com',
//                   'https://hooks.stripe.com',
//                 ],
//                 mediaSrc: ["'self'", 'blob:'],
//                 objectSrc: ["'none'"],
//                 baseUri: ["'self'"],
//                 formAction: ["'self'"],
//                 frameAncestors: ["'none'"],
//               },
//             }
//           : false,
//     }),
//   );

//   // Permissions Policy
//   app.use((_req, res, next) => {
//     res.setHeader(
//       'Permissions-Policy',
//       [
//         'accelerometer=()',
//         'camera=()',
//         'geolocation=(self)',
//         'gyroscope=()',
//         'magnetometer=()',
//         'microphone=()',
//         'payment=()',
//         'usb=()',
//         'fullscreen=(self)',
//       ].join(', '),
//     );
//     next();
//   });

//   // Global fallback error handler
//   app.use((err, _req, res, _next) => {
//     if (res.headersSent) return;
//     res.status(err.status || 500);
//     if (_req.path.startsWith('/api') || _req.path.startsWith('/admin')) {
//       return res.json({ message: err.message || 'Internal Server Error' });
//     }
//     res.type('html').send('<h1>Error occurred</h1>');
//   });

//   // Global prefix and middlewares
//   app.setGlobalPrefix('/api');
//   app.enableVersioning();
//   app.useGlobalPipes(new ApiValidationPipe());
//   app.useGlobalInterceptors(new ResponseInterceptor());
//   app.useGlobalFilters(new CustomExceptionFilter());

//   // Serve static assets from /public
//   app.useStaticAssets(resolve('./public'));
//   app.setBaseViewsDir(resolve('./views'));

//   // Optional seed/migration
//  const runMigration = process.argv.includes('--seed');
//   if (configService.getOrThrow('NODE_ENV') === 'development' && runMigration) {
//     console.log('🔹 Running migrations...');
//     await defaultUserCreate(app, logger);
//     console.log('🔹 Migrations finished. Closing app...');
//     await app.close();
//     process.exit(0);
//   }

//   // Swagger setup
//   if (configService.get('NODE_ENV') === 'development') {
//     const createConfig = (title: string, description: string) =>
//       new DocumentBuilder()
//         .setOpenAPIVersion('3.1.0')
//         .addBearerAuth()
//         .setTitle(title)
//         .setDescription(description)
//         .setVersion('1.0')
//         .addTag('Auth')
//         .addServer(backendUrl)
//         .build();

//     // ✅ Fixed Swagger logo path (works from /public/uploads/assets/nestjs.jpeg)
    
//     const customCss = `
//       .swagger-ui .topbar {
//         background-color: #1e293b;
//         border-bottom: 2px solid #0ea5e9;
//         height: 60px;
//         position: relative;
//       }
//       .swagger-ui .topbar::after {
//         content: '';
//         position: absolute;
//         right: 20px;
//         top: 10px;
//         width: 140px;
//         height: 40px;
//         background: url("${backendUrl}/uploads/assets/nestjs1.png") no-repeat center;
//         background-size: contain;
//       }
//       .swagger-ui .info h2 {
//         color: #0ea5e9;
//       }
//     `;

//     const configAdmin = createConfig(
//       `${configService.get('PROJECT_NAME')} Admin panel API`,
//       `The Admin panel API. <br><br> API endpoints for Frontend application API. <br> <a href="/apidoc/v1/user">Frontend application API-Doc</a> <br><br> 📥 OpenAPI JSON (Postman): <code>${backendUrl}/apidoc/v1/openapi.json</code>`,
//     );
//     const configApi = createConfig(
//       `${configService.get('PROJECT_NAME')} Frontend application API`,
//       `The User API. <br><br> API endpoints for Admin panel API. <br> <a href="/apidoc/v1">Admin panel API-Doc</a> <br><br> 📥 OpenAPI JSON (Postman): <code>${backendUrl}/apidoc/v1/user/openapi.json</code>`,
//     );

//     const documentAdmin = SwaggerModule.createDocument(app, configAdmin);
//     const documentApi = SwaggerModule.createDocument(app, configApi);

//     SwaggerModule.setup(
//       'apidoc/v1',
//       app,
//       {
//         ...documentAdmin,
//         paths: Object.fromEntries(
//           Object.entries(documentAdmin.paths).filter(
//             ([key]) =>
//               key.includes('admin') ||
//               (key.includes('auth') &&
//                 !key.includes('register') &&
//                 !key.includes('login-user') &&
//                 !key.includes('logout-user')),
//           ),
//         ),
//       },
//       {
//         customCss,
//         swaggerOptions: { defaultModelsExpandDepth: -1 },
//         jsonDocumentUrl: 'apidoc/v1/openapi.json',
//       },
//     );

//     SwaggerModule.setup(
//       'apidoc/v1/user',
//       app,
//       {
//         ...documentApi,
//         paths: Object.fromEntries(
//           Object.entries(documentApi.paths).filter(
//             ([key]) =>
//               !key.includes('admin') ||
//               (key.includes('auth') &&
//                 !key.includes('login-admin') &&
//                 !key.includes('logout-admin')),
//           ),
//         ),
//       },
//       {
//         customCss,
//         swaggerOptions: { defaultModelsExpandDepth: -1 },
//         jsonDocumentUrl: 'apidoc/v1/user/openapi.json',
//       },
//     );
//   }



//   const port = configService.getOrThrow('PORT') || 3000;
//   await app.listen(port, () => {
//     logger.debug(
//       `[${configService.get('PROJECT_NAME')} | ${configService.get('NODE_ENV')}] running: ${backendUrl}/apidoc/v1`,
//     );
//   });
// }

// bootstrap().catch(console.error);
