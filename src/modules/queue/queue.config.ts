import {BullModuleOptions} from '@nestjs/bull';

export const queueConfig: BullModuleOptions = {
    name: 'parcing-queue',
    redis: {
        host: "localhost",
        port: 6379,
    }
}