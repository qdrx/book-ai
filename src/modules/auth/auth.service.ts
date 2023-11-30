import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import {JwtService} from '@nestjs/jwt';
import {User} from '../../typeorm/entities/users.model';
import {CreateUserDto} from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import {DiscordAuthDTO} from './dto/discord-auth.dto';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private usersService: UsersService) {
    }

    async validateUser(username: string, password: string) {
        const user = await this.usersService.getUserByUsername(username);
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (user && isPasswordCorrect) {
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async login(user: User) {
        const payload = {username: user.username, sub: user.id, email: user.email};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async registration(userDto: CreateUserDto) {
        let candidate = await this.usersService.getUserByUsername(userDto.username);
        if (candidate) throw new HttpException("User with this name already exists", HttpStatus.BAD_REQUEST);
        candidate = await this.usersService.getUserByEmail(userDto.email);
        if (candidate) throw new HttpException("User with this email already exists", HttpStatus.BAD_REQUEST);
        const hashedPassword = await bcrypt.hash(userDto.password, 7);
        const user = await this.usersService.createUser({...userDto, password: hashedPassword});
        return await this.login(user);
    }

    async findOrCreateDiscordUser(dto: DiscordAuthDTO) {
        let candidate = await this.usersService.getUserByEmail(dto.email);
        if (candidate && !candidate.discordId) throw new HttpException("User with this email already exists, try logging in with your credentials", HttpStatus.BAD_REQUEST);
        candidate = await this.usersService.getUserByUsername(dto.username);
        if (candidate && !candidate.discordId) throw new HttpException("User with this name already exists", HttpStatus.BAD_REQUEST);
        if (candidate && candidate.discordId) {
            return await this.login(candidate);
        }
        if (!candidate) {
            const user = await this.usersService.createUser({...dto, password: "DISCORD_OAUTH2"});
            return await this.login(user);
        }
    }

}
