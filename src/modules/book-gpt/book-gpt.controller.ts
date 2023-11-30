import {Body, Controller, Get, Post, Req, UseFilters, UseGuards} from '@nestjs/common';
import {GetBookDto} from './dto/get-book.dto';
import {BookGptService} from './book-gpt.service';
import {ApiOperation, ApiResponse} from '@nestjs/swagger';
import {JwtAuthGuard} from '../../guards/jwt-auth.guard';
import {RatelimitExceptionFilter} from "../../filters/ratelimit-exception.filter";
import {RecommendationResponseDto} from "./dto/recommendation-response.dto";

@Controller('book-gpt')
export class BookGptController {

    constructor(private bookGPTService: BookGptService) {
    }

    @Get()
    async testfunc() {
        const books = await this.bookGPTService.getBooksRecommendation({
            genres: ['classic', 'drama'],
            authors: []
        }, 'admin');
        return {books: books}
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({summary: 'Get books recommendation from GPT Language Model'})
    @ApiResponse({status: 200, type: RecommendationResponseDto})
    @UseFilters(RatelimitExceptionFilter)
    async getBooks(@Req() req, @Body() dto: GetBookDto): Promise<RecommendationResponseDto> {
        const result = await this.bookGPTService.getBooksRecommendation(dto, req.username);
        return {books: result}
    }
}
