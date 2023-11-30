import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy, StrategyOptions} from "passport-discord";
import {AuthService} from "../modules/auth/auth.service";
import {Profile} from "passport";
import {ConfigService} from "@nestjs/config";

interface DiscordProfile extends Profile {
    email: string;
}

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        protected readonly configService: ConfigService,
    ) {
        super({
            clientID: configService.get('discordService.clientId'),
            clientSecret: configService.get('discordService.clientSecret'),
            callbackURL: configService.get('discordService.redirectUri'),
            scope: ['identify', 'email'],
        } as StrategyOptions);
    }

    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: DiscordProfile,
    ) {
        const {id, email, username} = profile;
        return await this.authService.findOrCreateDiscordUser({discordId: id, email, username});
    }
}