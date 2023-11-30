import {Injectable} from '@nestjs/common';
import axios from 'axios';
import {Book} from 'src/typeorm/entities/books.model';
import {BooksService} from 'src/modules/books/books.service';
import {IFetchedBookData} from "./interfaces/fetchedBookData.interface";

@Injectable()
export class BookParcerService {
    constructor(private readonly booksService: BooksService) {
    }

    public async fetchBookData(name: string) {
        try {
            const searchURI = `https://openlibrary.org/search.json?q=${name}`;
            const booksList = await axios.get(searchURI);
            const workId = booksList.data.docs[0].key;
            const worksURI = `https://openlibrary.org/${workId}.json`;
            const bookData = await axios.get(worksURI);
            const author = await axios.get(`https://openlibrary.org/${bookData.data.authors[0].author.key}`);
            bookData.data.author = author.data.name;
            return bookData.data;
        } catch (e) {
            throw new Error("Failed to fetch book data: " + e);
        }
    }

    async addBookToDB(name: string) {
        try {
            const bookData = await this.fetchBookData(name);
            const filteredBookData: Book = this.filterRawBookData(bookData);
            return await this.booksService.addBook(filteredBookData);
        } catch (e) {
            throw new Error("Failed to add book to DB: " + e);
        }

    }

    private filterRawBookData(data: IFetchedBookData<any>): Book {
        try {
            const descriptionDelimiter = "\r\n";
            if (!data.description.value) {
                data.description = data.description.split(descriptionDelimiter)[0];
            }
            data.description = data.description.value.split(descriptionDelimiter)[0];
        } catch (e) {
        }
        return {
            title: data.title,
            description: data.description ? data.description : "Not available yet",
            cover: `https://covers.openlibrary.org/b/id/${data.covers[0]}.jpg`,
            author: data.author,
        };

    }
}