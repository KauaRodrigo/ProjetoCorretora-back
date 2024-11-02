import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/config.module';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';
import { UsersModule } from './modules/users/users.module';
import { SequelizeConfigModule } from './database/sequelize.module';
import { AuthModule } from './modules/auth/auth.module';
import { SinistrosController } from './modules/sinistros/sinistros.controller';
import { SinistrosModule } from './modules/sinistros/sinistros.module';

@Module({
  imports: [DatabaseModule, SequelizeConfigModule,UsersModule, AuthModule, SinistrosModule],
  controllers: [AppController, UsersController, SinistrosController],
  providers: [AppService, UsersService],
})
export class AppModule {}
