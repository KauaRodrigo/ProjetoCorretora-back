import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/database/models/user.model';
import Roles from 'src/database/models/role.model';
import UserRole from 'src/database/models/userRole.model';

@Module({
    imports: [SequelizeModule.forFeature([User, Roles, UserRole])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}
