import {Injectable} from '@nestjs/common';
import {User} from '../../typeorm/entities/users.model';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateUserDto} from './dto/create-user.dto';
import {UserRequest} from '../../typeorm/entities/user-requests.model';
import {UserRequestDto} from './dto/user-requests.dto';
import {Book} from 'src/typeorm/entities/books.model';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserRequest) private requestsRepository: Repository<UserRequest>
    ) {
    }

    async createUser(dto: CreateUserDto): Promise<User> {
        dto.username = dto.username.toLowerCase();
        const user = this.userRepository.create(dto);
        return await this.userRepository.save(user);
    }

    async getUserById(id: number): Promise<User> {
        return await this.userRepository.findOne({where: {id}});
    }

    async getUserByUsername(username: string): Promise<User> {
        return await this.userRepository.findOne({where: {username: username}});
    }

    async getUserByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({where: {email}});
    }

    // async updateUser(): Promise<User> {
    //
    // }

    async createUserRequest(dto: UserRequestDto): Promise<UserRequest> {
        const user = await this.getUserByUsername(dto.requester);
        const userRequest = this.requestsRepository.create({requester: user, books: []});
        return await this.requestsRepository.save(userRequest);
    }

    async getUserRequestsById(id: number): Promise<UserRequest[]> {
        return await this.requestsRepository.find({where: {id: id}, relations: ['books']});
    }

    async addBookToRequest(id: number, book: Book): Promise<UserRequest> {
        const userRequests = await this.requestsRepository.find({where: {id: id}, relations: ['books']});
        const userRequest = userRequests[userRequests.length - 1]
        if (!Array.isArray(userRequest.books)) {
            userRequest.books = [];
        }
        userRequest.books = [...userRequest.books, book];
        return await this.requestsRepository.save(userRequest);
    }

}
