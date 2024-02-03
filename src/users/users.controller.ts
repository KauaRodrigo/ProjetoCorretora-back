import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/database/models/user.model';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
    @Get()
    async findUserByEmail(@Query() email: string): Promise<User[]> {
        return this.usersService.findAll()
    }
}
