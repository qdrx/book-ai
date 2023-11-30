import {Module} from '@nestjs/common';
import {BooksModule} from 'src/modules/books/books.module';
import {BookParcerService} from './book-parcer.service';


@Module({
    imports: [BooksModule],
    exports: [BookParcerService],
    providers: [BookParcerService]
})
export class BookParcerModule {
}
