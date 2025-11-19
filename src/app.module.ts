import { Module } from '@nestjs/common';

// FIXED: no alias, use relative paths
import { HelpersModule } from './helpers/helpers.module';

// refresh-token module

// role module

// user devices repository module

// user repository module

// users module

// config module
import { ApiConfigModule } from './config.module';

@Module({
    imports: [
        ApiConfigModule,
        HelpersModule,
    ],
    providers: [],
})
export class AppModule {}
