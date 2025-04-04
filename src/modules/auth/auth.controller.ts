import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

type signInDto = {
    email   : string,
    password: string
}

type resetGenerate = {
    email: string    
}

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,        
    ) {}

    @Post('login')
    sigIn(@Body() payload: signInDto) {        
        return this.authService.signIn(payload.email, payload.password);
    }

    @Post('passwordreset')
    async generatePasswordResetToken(@Body() payload: resetGenerate, @Res() response: Response) {        
        const oRetorno: any = await this.authService.createResetToken(payload.email);

        return response.send({
            status: oRetorno?.status ?? 200,
            message: oRetorno?.message ?? null
        })
    }

    @Get('passwordreset/verify') 
    verifyResetToken(@Query() payload: any) {        
        return this.authService.verifyResetToken(payload.token);
    }

    @Post('passwordreset/update')
    updatePassword(@Body() payload: any) {        
        return this.authService.updatePassword(payload);
    }

}
