import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/config.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { SequelizeConfigModule } from './database/sequelize.module';
import { AuthModule } from './auth/auth.module';
import { SinistrosController } from './sinistros/sinistros.controller';
import { SinistrosModule } from './sinistros/sinistros.module';

@Module({
  imports: [DatabaseModule, SequelizeConfigModule,UsersModule, AuthModule, SinistrosModule],
  controllers: [AppController, UsersController, SinistrosController],
  providers: [AppService, UsersService],
})
export class AppModule {}
