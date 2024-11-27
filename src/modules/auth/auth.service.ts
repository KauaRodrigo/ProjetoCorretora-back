import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import PasswordResetTokenModel from 'src/database/models/passwordResetToken.model';
import { User } from 'src/database/models/user.model';
import { UsersService } from 'src/modules/users/users.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private emailService: EmailService,
        @InjectModel(PasswordResetTokenModel) readonly tokenModel: typeof PasswordResetTokenModel,
        @InjectModel(User) readonly userModel: typeof User,
        @Inject('SEQUELIZE') private sequelize: Sequelize
    ) {}
 
    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.userService.findByEmail(email) 

        console.log(pass, user?.password)
        console.log(await bcrypt.compare(pass, user?.password))
        if(!await bcrypt.compare(pass, user?.password)) {
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
            resetTokenExpires: new Date(Date.now() + 30 * 60 * 1000),
            dataCriacaoToken:  new Date()
        }, {
            where: {
            id: user.id
        }})

        this.emailService.sendValidationEmail(email, token);        
    }

    async verifyResetToken(token: string) {        
        return this.userModel.findOne({
            where: {
                resetToken: token,
                resetTokenExpires: {
                    [Op.gte]: new Date(),                    
                },
                dataCriacaoToken: {
                    [Op.gt]: this.sequelize.col('updatedAt')
                }
            }
        })
    }

    async updatePassword(payload: { password: string, token: string }) {        
        const password = await bcrypt.hash(payload.password, 10);

        const userId = (await this.userModel.findOne({
            where: {
                resetToken: payload.token
            }
        })).id

        return this.userModel.update({
            password
        }, {
            where: {
                id: userId
            }
        })
    }
}
