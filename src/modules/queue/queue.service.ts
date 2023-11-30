import {Injectable} from '@nestjs/common';
import {InjectQueue, OnQueueActive} from '@nestjs/bull';
import {Job, Queue} from 'bull';

@Injectable()
export class QueueService {
    constructor(@InjectQueue('parcing-queue') private readonly bookQueue: Queue) {
    }

    async addBookTask(bookName: string, username: string, requestId: number) {
        await this.bookQueue.add('process-book', {bookName, username, requestId});
    }

    @OnQueueActive()
    onActive(job: Job) {
        console.log(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
    }
}
