import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Roles from 'src/database/models/role.model';
import { User } from 'src/database/models/user.model';
import UserRole from 'src/database/models/userRole.model';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User) readonly userModel: typeof User,
        @InjectModel(Roles) readonly roleModel: typeof Roles,
        @InjectModel(UserRole) readonly userRoleModel: typeof UserRole
    ) {}    

    async findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({
            where: {
                email: email,
            },
            include: [this.roleModel]
        })
    }

}
