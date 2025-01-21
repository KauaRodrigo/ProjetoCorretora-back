import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/database/models/user.model';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
    /**
     * Rota para buscar um usuário pelo email
     * 
     * @param email 
     * @returns {User}
     */
    @Get()
    async findUserByEmail(@Query() email: string): Promise<User> {        
        return this.usersService.findByEmail(email)
    }
}
