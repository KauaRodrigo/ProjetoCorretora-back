import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { SequelizeConfigModule } from './database/sequelize.module';
import { DatabaseModule } from './database/config.module';

@Module({
  imports: [UsuariosModule, DatabaseModule, SequelizeConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
