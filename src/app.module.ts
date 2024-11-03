import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';
import { UsersModule } from './modules/users/users.module';
import { SequelizeConfigModule } from './database/sequelize.module';
import { AuthModule } from './modules/auth/auth.module';
import { SinistrosController } from './modules/sinistros/sinistros.controller';
import { SinistrosModule } from './modules/sinistros/sinistros.module';

@Module({
  imports: [DatabaseModule, SequelizeConfigModule,UsersModule, AuthModule, SinistrosModule],
  controllers: [UsersController, SinistrosController],
  providers: [UsersService],
})
export class AppModule {}
