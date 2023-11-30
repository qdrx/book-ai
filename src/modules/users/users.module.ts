import {Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {User} from '../../typeorm/entities/users.model';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserRequest} from '../../typeorm/entities/user-requests.model';


@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [TypeOrmModule.forFeature([User, UserRequest])],
    exports: [UsersService]
})
export class UsersModule {
}
