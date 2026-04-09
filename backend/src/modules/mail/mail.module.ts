import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAILUSER,
          pass: process.env.MAILPASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: 'Kho',
      },
    }),
  ],
})
export class MailModule {}
