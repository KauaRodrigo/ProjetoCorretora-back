import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService
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
}
