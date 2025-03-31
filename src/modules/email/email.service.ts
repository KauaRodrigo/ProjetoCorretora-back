import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import * as nodemailer from 'nodemailer';
import { User } from 'src/database/models/user.model';

@Injectable()
export class EmailService {

  private transporter: nodemailer.Transporter;  

  constructor(private configService: ConfigService, @InjectModel(User) readonly userModel: typeof User) {
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

  async sendValidationEmail(sEmail: string, sToken: string): Promise<{ statusCode: number, message: string }> {
    const sAppUrl = this.configService.get('APP_URL');

    const oUser = await this.userModel.findOne({
      where: {
        email: sEmail
      }
    });    

    if(!oUser) {
      return {
        statusCode: 404,
        message: 'Não existe nenhum usuário cadastrado com o endereço de email informado.\n Verifique o email e tente novamente!'
      }
    }

    await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: sEmail,
      subject: 'Validação de Email',
      html: `
        <h1>Validação de Email</h1>
        <p>Por favor, clique no link abaixo para validar seu email:</p>
        <a href="${sAppUrl}/recuperarsenha/${sToken}">
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