import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/database/models/user.model';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) readonly userModel: typeof User) {}

    async findAll(): Promise<User[]> {
        return this.userModel.findAll();
    }

    async findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({
            where: {
                email: email,
            }
        })
    }

}
