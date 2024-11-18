import { EmailModule } from './modules/email/email.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';
import { UsersModule } from './modules/users/users.module';
import { SequelizeConfigModule } from './database/sequelize.module';
import { AuthModule } from './modules/auth/auth.module';
import { SinistrosController } from './modules/sinistros/sinistros.controller';
import { SinistrosModule } from './modules/sinistros/sinistros.module';
import emailConfig from './config/email.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule, 
    SequelizeConfigModule,
    UsersModule, 
    AuthModule, 
    SinistrosModule, 
    EmailModule, 
    ConfigModule.forRoot(
      { 
        load: [emailConfig],
        isGlobal: true 
      }
    )],
  controllers: [UsersController, SinistrosController],
  providers: [UsersService], 
})
export class AppModule {}
