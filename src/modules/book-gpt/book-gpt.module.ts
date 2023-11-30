import {Module} from '@nestjs/common';
import {BookGptService} from './book-gpt.service';
import {BookParcerModule} from 'src/modules/book-parcer/book-parcer.module';
import {QueueModule} from 'src/modules/queue/queue.module';
import {UsersModule} from '../users/users.module';

@Module({
    providers: [BookGptService],
    imports: [BookParcerModule, QueueModule, UsersModule],

})
export class BookGptModule {
}
