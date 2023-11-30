import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {UsersModule} from '../users/users.module';
import {AuthService} from './auth.service';
import {LocalStrategy} from '../../strategies/local.strategy';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {JwtStrategy} from '../../strategies/jwt.strategy';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {DiscordStrategy} from '../../strategies/discord.strategy';


@Module({
    controllers: [AuthController],
    imports: [ConfigModule,
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('jwtService.secret'),
                signOptions: {
                    expiresIn: '60m',
                },
            }),
            inject: [ConfigService]
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, DiscordStrategy],
    exports: [AuthService],
})
export class AuthModule {
}
