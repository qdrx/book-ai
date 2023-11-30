import {IJsonBooks} from "../interfaces/jsonBooks.interface";
import {ApiProperty} from "@nestjs/swagger";

export class RecommendationResponseDto {
    @ApiProperty({
        example: [
            {
                "author": "Haruki Murakami",
                "book": "Norwegian Wood"
            },
            {
                "author": "Zadie Smith",
                "book": "White Teeth"
            }, {
                "author": "Jhumpa Lahiri",
                "book": "The Namesake"
            }
        ],
        description: "Array of preferred genres"
    })
    books: IJsonBooks[]
}