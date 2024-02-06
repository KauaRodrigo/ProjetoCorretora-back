import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private jtwService: JwtService
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    sigIn(@Body() signInDto: { email: string, password: string }) {
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user
    }

}
