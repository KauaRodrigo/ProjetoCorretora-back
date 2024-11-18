import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendValidationEmail(email: string, token: string): Promise<void> {
    const appUrl = this.configService.get('APP_URL');

    await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'Validação de Email',
      html: `
        <h1>Validação de Email</h1>
        <p>Por favor, clique no link abaixo para validar seu email:</p>
        <a href="${appUrl}/passwordReset/${token}">
          Validar Email
        </a>
        <p>Este link expira em 1 hora.</p>
      `,
    });
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Erro na verificação do email:', error);
      return false;
    }
  }
}