import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import Roles from 'src/database/models/role.model';
import { User } from 'src/database/models/user.model';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User) readonly userModel: typeof User,
        @InjectModel(Roles) readonly roleModel: typeof Roles 
    ) {}    
    
    async create(payload: any): Promise<any> {
        const user = await this.userModel.create(payload)

        const roles = await this.roleModel.findAll({
            where: {
                name: {
                    [Op.in]: payload.roles   
                }
            }
        })

        await user.$set('roles', roles)

        return user
    }

    async findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({
            where: {
                email: email,
            }
        })
    }

}
