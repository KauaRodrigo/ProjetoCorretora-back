import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { User } from './models/user.model';
import Roles from './models/role.model';
import Sinistro from './models/sinistro.model';
import UserRole from './models/userRole.model';

@Module({ 
  imports: [SequelizeModule.forFeature([User, Roles, Sinistro, UserRole])],
  exports: [SequelizeModule],
})
export class SequelizeConfigModule {} 