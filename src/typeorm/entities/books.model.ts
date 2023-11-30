import {ApiProperty} from '@nestjs/swagger';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    @ApiProperty({example: 1, description: "Unique identifier of book"})
    id?: number;

    @Column({unique: true})
    @ApiProperty({example: "The Great Gatsby", description: "Name of the book"})
    title: string;

    @Column()
    @ApiProperty({
        example: "Pride and Prejudice is an 1813 novel of manners written by Jane Austen. The novel follows the character development of Elizabeth Bennet, the dynamic protagonist of the book who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.",
        description: "Description of the book"
    })
    description: string;

    @Column()
    @ApiProperty({
        example: "https://covers.openlibrary.org/b/id/426182.jpg",
        description: "Link for the cover of the book"
    })
    cover: string;

    @Column()
    @ApiProperty({example: "Ernest Hemingway", description: "Author's name"})
    author: string;
}