import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Usuarios } from 'src/database/models/usuario.model';

@Module({
  imports: [SequelizeModule.forFeature([Usuarios])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
