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
import { ClienteModule } from './modules/clientes/clientes.module';
import { ClienteController } from './modules/clientes/clientes.controller';
import { SeguradoraController } from './modules/seguradora/seguradora.controller';
import { SeguradoraModule } from './modules/seguradora/seguradora.module';

@Module({
  imports: [
    DatabaseModule, 
    SequelizeConfigModule,
    UsersModule,  
    AuthModule, 
    SinistrosModule, 
    EmailModule, 
    ClienteModule,
    SeguradoraModule,
    ConfigModule.forRoot(
      { 
        load: [emailConfig],
        isGlobal: true 
      }
    )],
  controllers: [UsersController, SinistrosController, ClienteController, SeguradoraController],
  providers: [UsersService], 
})
export class AppModule {}
