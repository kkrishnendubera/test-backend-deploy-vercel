import { Global, Module } from '@nestjs/common';
import { MailerService } from './mailer.helper';


@Global()
@Module({
    providers: [MailerService],
    exports: [MailerService]
})
export class HelpersModule { }