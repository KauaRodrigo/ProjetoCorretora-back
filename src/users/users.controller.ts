import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/database/models/user.model';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
    @Post()
    async crate(@Body() payload: any): Promise<any> {
        return this.usersService.create(payload);
    }

    @Get()
    async findUserByEmail(@Query() email: string): Promise<User> {
        return this.usersService.findByEmail(email)
    }
}
