import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { UsersModule } from '../users/users.module';
import { databaseProvider } from 'src/config/database.config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/database/models/user.model';


@Module({
  imports: [ConfigModule, UsersModule, SequelizeModule.forFeature([User]),],
  providers: [EmailService, ...databaseProvider],
  controllers: [EmailController],
  exports: [EmailService, ...databaseProvider],
})
export class EmailModule {}