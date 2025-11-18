import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
// import { APP_GUARD } from '@nestjs/core';
// import { ThrottlerBehindProxyGuard } from '@common/guards/throttler-behind-proxy.guard';


@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),

    //  Mongoose setup
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URI'),
        dbName: configService.getOrThrow<string>('DB_DATABASE'),
        // maxPoolSize: 20, // prevent overload
      }),
    }),

    //  JWT setup
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        privateKey: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
        },
      }),
    }),

    // ✅ Throttler config (global rate limit)
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100,   // 10 requests per IP
      },
    ]),
  ],
  providers: [
    Logger,
     //  Apply ThrottlerGuard globally
    //  {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerBehindProxyGuard,
    // },
    //  Global S3Client provider
    // {
    //   provide: S3Client,
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     return new S3Client({
    //       region: configService.get<string>('AWS_REGION'),
    //       credentials: {
    //         accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
    //         secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    //       },
    //     });
    //   },
    // },
  ],
  exports: [JwtModule],
})
export class ApiConfigModule { }
