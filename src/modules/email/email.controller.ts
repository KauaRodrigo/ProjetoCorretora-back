import { Controller, Post, Body, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}  

  @Get('test-connection')
  async testConnection() {
    const isConnected = await this.emailService.verifyConnection();
    return { status: isConnected ? 'connected' : 'error' };
  }
}