import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {GetBookDto} from './dto/get-book.dto';
import OpenAI from 'openai';
import {QueueService} from 'src/modules/queue/queue.service';
import {UsersService} from "../users/users.service";
import {ChatCompletion} from "openai/src/resources/chat/completions";
import {IJsonBooks} from "./interfaces/jsonBooks.interface";
import {RateLimitError} from "openai/error";
import {CustomRatelimitError} from "../../common/exceptions/custom-ratelimit.error";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class BookGptService {

    private readonly openAI: OpenAI;

    constructor(
        private readonly queueService: QueueService,
        private readonly usersService: UsersService,
        protected readonly configService: ConfigService,
    ) {
        this.openAI = new OpenAI({
            apiKey: configService.get("openAi.apiKey"),
        });
    }

    async getBooksRecommendation(data: GetBookDto, requester: string): Promise<IJsonBooks[]> {
        try {
            let bookRecommendation: ChatCompletion;
            let result: IJsonBooks[];
            for (let i = 0; i < 10; i++) {
                bookRecommendation = await this.openAI.chat.completions.create({
                    messages: [{
                        role: "system", content: "Starting now, your role is that of a book recommendation assistant, and you will receive information in the following format: \
                Genres: This will outline the genres that pique the users interest.\
                Authors: This will specify the authors whose books the user prefers. \
                You must answer ONLY in the format 'Liane Moriarty - The Alchemist', with the language being English. \
                Based on this input, your task is to curate a list of 10 books that align with the user's reading preferences. Books should be available at openlibrary. Dont limit your selections solely to the authors mentioned by the user; also consider authors who write at a similar level to those mentioned by the user."

                    },
                        {role: "user", content: `Genres: ${data.genres} \n Authors: ${data.authors}`}],
                    model: "gpt-3.5-turbo",
                });
                console.log(bookRecommendation.choices[0].message);
                result = await this.plainBooksToJsonList(bookRecommendation.choices[0].message.content);
                console.log(result)
                if (result.length > 1) {
                    break;
                }
            }
            const userRequest = await this.usersService.createUserRequest({requester});
            for (const book of result) {
                await this.queueService.addBookTask(book.title, requester, userRequest.id);
                console.log("added book to queue");
            }
            return result;
        } catch (e) {
            console.log(e)
            if (e instanceof RateLimitError) throw new CustomRatelimitError("OpenAPI rate limit exceeded, please wait", 500);
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    private async plainBooksToJsonList(plainList: string): Promise<IJsonBooks[]> {
        const bookLines = plainList.split('\n');
        const books: IJsonBooks[] = []
        bookLines.forEach((line) => {
            const parts = line.split('-');
            if (parts.length === 2) {
                const author = parts[0].trim().replace(/^\d+\.\s*/, '');
                const book = parts[1].trim().replaceAll('\"', '');
                books.push({author, title: book});
            }
        });
        return books;
    }
}
