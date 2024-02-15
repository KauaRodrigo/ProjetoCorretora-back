import { UsersService } from './users.service';
import { User } from 'src/database/models/user.model';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    crate(payload: any): Promise<any>;
    findUserByEmail(email: string): Promise<User>;
}
