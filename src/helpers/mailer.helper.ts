import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import nodemailer from 'nodemailer';
import Email from 'email-templates';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailerService {
    constructor(
        private readonly configService: ConfigService
    ) { }

    async sendMail(from: string, to: string | string[], subject: string, tplName: string, locals: any): Promise<SMTPTransport.SentMessageInfo> {
        const templateDir = resolve('./views/', 'email-templates', tplName, 'html');
        const email = new Email({
            views: {
                root: templateDir,
                options: {
                    extension: 'ejs',
                },
            },
        });

        const getMailBody = await email.render(templateDir, locals);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.getOrThrow<string>('MAIL_USERNAME'),
                pass: this.configService.getOrThrow<string>('MAIL_PASSWORD'),
            },
        });

        // const transporter = nodemailer.createTransport(new SMTPTransport({
        //     host: this.configService.getOrThrow<string>('MAIL_HOST'),
        //     port: parseInt(this.configService.getOrThrow<string>('MAIL_PORT'), 10), // Ensure it's a number
        //     secure: false, // true for 465, false for other ports
        //     auth: {
        //         user: this.configService.getOrThrow<string>('MAIL_USERNAME'),
        //         pass: this.configService.getOrThrow<string>('MAIL_PASSWORD'),
        //     },
        // }));

        const mailOptions = {
            from,
            to,
            subject,
            html: getMailBody,
        };

        return await transporter.sendMail(mailOptions);
    }
}
