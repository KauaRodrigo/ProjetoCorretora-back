import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { Usuarios } from 'src/database/models/usuario.model';

@Injectable()
export class UsuariosService {

  constructor(@InjectModel(Usuarios) private usuariosModel: Model<Usuarios>) {}

  create(createUsuarioDto: any) {
    return 'This action adds a new usuario';
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: any) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
