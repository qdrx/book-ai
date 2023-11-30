import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Book} from '../../typeorm/entities/books.model';
import {Repository} from 'typeorm';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private booksRepository: Repository<Book>,
    ) {
    }

    async addBook(book: Book): Promise<Book> {
        const newBook = this.booksRepository.create(book);
        await this.booksRepository.save(newBook);
        return newBook;
    }

    async findAll(): Promise<Book[]> {
        return this.booksRepository.find();
    }

    async findOne(id: number): Promise<Book | null> {
        return this.booksRepository.findOneBy({id});
    }

    async remove(id: number): Promise<void> {
        await this.booksRepository.delete(id);
    }

    async findByName(name: string) {
        return this.booksRepository.findOne({where: {title: name}});
    }
}
