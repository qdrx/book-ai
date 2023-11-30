import {ApiProperty} from '@nestjs/swagger';
import {IsArray, IsString,} from 'class-validator';


export class GetBookDto {
    @IsArray()
    @IsString({each: true})
    @ApiProperty({example: ["Classic", "Drama", "Detective"], description: "Array of preferred genres"})
    genres: string[];

    @IsArray()
    @IsString({each: true})
    @ApiProperty({
        example: ["Ernest Hemingway", "George Orwell", "William Shakespeare"],
        description: "Array of preferred authors"
    })
    authors: string[];
}