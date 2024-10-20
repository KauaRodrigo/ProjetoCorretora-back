import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,        
    ) {}

    @Post('login')
    sigIn(@Body() signInDto: { email: string, password: string }) {        
        return this.authService.signIn(signInDto.email, signInDto.password);
    }    

}
