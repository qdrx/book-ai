import {MiddlewareConsumer, Module, NestModule, ValidationPipe} from '@nestjs/common';
import {LoggerMiddleware} from './modules/logger/logger.middleware';
import {ThrottlerGuard, ThrottlerModule} from '@nestjs/throttler';
import {APP_GUARD, APP_PIPE} from '@nestjs/core';
import {BookGptController} from "./modules/book-gpt/book-gpt.controller";
import {BookGptService} from './modules/book-gpt/book-gpt.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {BookGptModule} from './modules/book-gpt/book-gpt.module';
import {BookParcerService} from './modules/book-parcer/book-parcer.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BooksService} from './modules/books/books.service';
import {BookParcerModule} from './modules/book-parcer/book-parcer.module';
import {BooksModule} from './modules/books/books.module';
import {QueueService} from './modules/queue/queue.service';
import {QueueModule} from './modules/queue/queue.module';
import {Book} from './typeorm/entities/books.model';
import {BullModule} from '@nestjs/bull';
import {UsersModule} from './modules/users/users.module';
import {User} from './typeorm/entities/users.model';
import {AuthService} from './modules/auth/auth.service';
import {AuthModule} from './modules/auth/auth.module';
import {JwtService} from '@nestjs/jwt';
import {UserRequest} from './typeorm/entities/user-requests.model';
import {RatelimitExceptionFilter} from "./filters/ratelimit-exception.filter";
import {RatelimitBlockMiddleware} from "./middleware/ratelimit-block.middleware";
import configuration from "./common/config/configuration";
import * as process from "process";


@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
            load: [configuration],
            isGlobal: true
        }),
        ThrottlerModule.forRoot([{
            ttl: Number(process.env.BOOK_TTL) || 60000,
            limit: 1,
        }]),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.user'),
                password: configService.get('database.password'),
                database: configService.get('database.dbName'),
                entities: [Book, User, UserRequest],
                synchronize: true,
                autoLoadEntities: true
            })
        }),
        BullModule.forRoot({
            redis: {
                host: 'localhost',
                port: 6379,
            },
        }),
        BooksModule,
        QueueModule,
        BookParcerModule,
        BookGptModule,
        UsersModule,
        AuthModule,
    ],
    controllers: [BookGptController],
    providers: [{
        provide: APP_GUARD,
        useClass: ThrottlerGuard
    }, {
        provide: APP_PIPE,
        useClass: ValidationPipe,
    }, BookGptService, BookParcerService, BooksService, QueueService, AuthService, JwtService, RatelimitBlockMiddleware, RatelimitExceptionFilter]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware, RatelimitBlockMiddleware)
            .forRoutes(BookGptController)
    }
}

