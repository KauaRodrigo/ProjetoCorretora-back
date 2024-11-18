import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { User } from './models/user.model';
import Clientes from './models/clientes.model'
import Roles from './models/role.model';
import Sinistro from './models/sinistro.model';
import UserRole from './models/userRole.model';
import Seguradora from "./models/seguradora.model";
import Adress from "./models/adress.model";
import Comments from "./models/comments.model";
import PasswordResetTokenModel from './models/passwordResetToken.model';

@Module({ 
  imports: [SequelizeModule.forFeature([
    User, 
    Adress, 
    Comments, 
    Clientes, 
    Seguradora, 
    Roles, 
    Sinistro, 
    UserRole,
    PasswordResetTokenModel 
  ])],
  exports: [SequelizeModule],
})
export class SequelizeConfigModule {} 