import {Module} from '@nestjs/common';
import {QueueService} from './queue.service';
import {BullModule} from '@nestjs/bull';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'parcing-queue',
        }),
    ],
    providers: [QueueService],
    exports: [QueueService, BullModule],
})
export class QueueModule {
}
