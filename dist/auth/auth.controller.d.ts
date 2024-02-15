import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    sigIn(signInDto: {
        email: string;
        password: string;
    }): Promise<any>;
    getProfile(user: any): any;
}
