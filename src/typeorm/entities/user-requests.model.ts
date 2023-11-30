import {Book} from 'src/typeorm/entities/books.model';
import {CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './users.model';
import {ApiProperty} from '@nestjs/swagger';

@Entity()
export class UserRequest {
    @PrimaryGeneratedColumn()
    @ApiProperty({example: 1, description: "Unique identifier of request"})
    id?: number;

    @ManyToOne(() => User, user => user.requests)
    @JoinColumn({name: 'requester'})
    requester: User;

    @CreateDateColumn()
    @ApiProperty({example: "2023-09-19T19:39:45.043Z", description: "Date of request creation"})
    created_at: Date;

    @ApiProperty({
        example: {
            "id": 28,
            "title": "En man som heter Ove",
            "description": "A grumpy yet loveable man finds his solitary world turned on its head when a boisterous young family moves in next door.",
            "cover": "https://covers.openlibrary.org/b/id/7437001.jpg",
            "author": "Fredrik Backman"
        }, description: "Books received on request"
    })
    @ManyToMany(() => Book)
    @JoinTable()
    books?: Book[];
}