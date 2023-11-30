import {Module} from '@nestjs/common';
import {BooksService} from './books.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Book} from '../../typeorm/entities/books.model';
import {QueueModule} from 'src/modules/queue/queue.module';
import {BooksProcessor} from './books.processor';
import {BookParcerService} from 'src/modules/book-parcer/book-parcer.service';
import {UsersModule} from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Book]), QueueModule, UsersModule],
    providers: [BooksService, BooksProcessor, BookParcerService],
    exports: [BooksService, TypeOrmModule]
})
export class BooksModule {
}
