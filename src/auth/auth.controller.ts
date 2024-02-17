import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { User } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,        
    ) {}

    @Post('login')
    sigIn(@Body() signInDto: { email: string, password: string }) {        
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@User() user) {    
        return user
    }

}
