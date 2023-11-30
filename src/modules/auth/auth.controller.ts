import {Body, Controller, Get, Post, Query, Req, Request, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {LoginDto} from './dto/login.dto';
import {AuthService} from './auth.service';
import {CreateUserDto} from '../users/dto/create-user.dto';
import {ApiOperation, ApiResponse} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    @ApiOperation({summary: 'Login with credentials and get access token',})
    @ApiResponse({status: 200, description: '{access_token: "some.token"}'})
    login(@Request() req, @Body() dto: LoginDto) {
        return this.authService.login(req.user);
    }

    @Post('register')
    @ApiOperation({summary: 'Register with credentials and get access token',})
    @ApiResponse({status: 200, description: '{access_token: "some.token"}'})
    register(@Body() dto: CreateUserDto) {
        return this.authService.registration(dto);
    }

    @Get('discord')
    @UseGuards(AuthGuard('discord'))
    discord() {
    }

    @Get('discord/callback')
    @UseGuards(AuthGuard('discord'))
    discordCallback(@Req() req, @Query('code') code: string) {
        return req.user;
    }


}
