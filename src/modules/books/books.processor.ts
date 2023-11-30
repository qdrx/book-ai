import {Process, Processor} from '@nestjs/bull';
import {Job} from 'bull';
import {BooksService} from './books.service';
import {BookParcerService} from 'src/modules/book-parcer/book-parcer.service';
import {UsersService} from '../users/users.service';

@Processor('parcing-queue')
export class BooksProcessor {
    constructor(private readonly booksParcer: BookParcerService, private readonly usersService: UsersService, private readonly booksService: BooksService) {
    }

    @Process('process-book')
    async processBook(job: Job) {
        try {
            const {bookName, id} = job.data;
            const openLibBookName = await this.booksParcer.fetchBookData(bookName);
            let book = await this.booksService.findByName(openLibBookName.title);
            if (!book) {
                book = await this.booksParcer.addBookToDB(bookName);
            }
            await this.usersService.addBookToRequest(id, book);
            job.progress(100);
        } catch (error) {
            console.error(`Error processing job ${job.id}: ${error}`);
            throw error;
        }
    }
}

