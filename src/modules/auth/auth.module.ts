import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { SequelizeModule } from '@nestjs/sequelize';
import PasswordResetTokenModel from 'src/database/models/passwordResetToken.model';
import { User } from 'src/database/models/user.model';
import { EmailService } from '../email/email.service';

@Module({
  imports: [
    SequelizeModule.forFeature([PasswordResetTokenModel, User]),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2d' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
  exports: [AuthService]
})
export class AuthModule {}
