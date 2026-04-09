import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  @OnEvent('product.low_stock')
  async sendWelcomeEmail(
    userEmail: string,
    userName: string,
    text: string,
    subject: string,
  ) {
    await this.mailerService.sendMail({
      to: userEmail,
      subject: subject,
      template: text,
      context: {
        name: userName,
      },
    });
  }
}
