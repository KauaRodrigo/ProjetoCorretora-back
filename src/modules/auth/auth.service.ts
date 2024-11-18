import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import PasswordResetTokenModel from 'src/database/models/passwordResetToken.model';
import { User } from 'src/database/models/user.model';
import { UsersService } from 'src/modules/users/users.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private emailService: EmailService,
        @InjectModel(PasswordResetTokenModel) readonly tokenModel: typeof PasswordResetTokenModel,
        @InjectModel(User) readonly userModel: typeof User        
    ) {}
 
    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.userService.findByEmail(email) 

        if(user?.password !== pass) {
            throw new UnauthorizedException();
        }        

        const payload = {
            id: user.id,
            roles: user.roles.map((role) => {
                return role.name
            }),
            username: user.name
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: payload 
        };
    }

    async createResetToken(email: string) {
        const user = await this.userService.findByEmail(email);

        if(!user) {
            return {
                status: 404,
                message: `Nenhum usuário encontrado com o email "${email}"`
            };
        }

        const token = await crypto.randomUUID();

        this.userModel.update({
            resetToken: token,
            resetTokenExpires: new Date(Date.now() + 30 * 60 * 1000)            
        }, {where: {
            id: user.id
        }})

        this.emailService.sendValidationEmail(email, token);
        
    }

    async verifyResetToken(token: string) {        
        return this.userModel.findOne({
            where: {
                resetToken: token,
                resetTokenExpires: {
                    [Op.gte]: new Date()
                }
            }
        })
    }

    async updatePassword(password: string) {
        return this.userModel.update({
            password
        }, {where: {id: 4}})
    }
}
