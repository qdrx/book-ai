import {ClassSerializerInterceptor, Controller, Get, Request, UseGuards, UseInterceptors} from '@nestjs/common';
import {ApiOperation, ApiResponse} from '@nestjs/swagger';
import {JwtAuthGuard} from '../../guards/jwt-auth.guard';
import {User} from '../../typeorm/entities/users.model';
import {UsersService} from './users.service';
import {UserRequest} from '../../typeorm/entities/user-requests.model';


@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOperation({summary: 'Get profile data'})
    @ApiResponse({status: 200, type: User})
    async getProfile(@Request() req) {
        return await this.usersService.getUserById(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('requests')
    @ApiOperation({summary: "Get user's requests history"})
    @ApiResponse({status: 200, type: UserRequest})
    async getRequests(@Request() req) {
        return await this.usersService.getUserRequestsById(req.user.id);
    }
}
