import {HttpException} from "@nestjs/common";

export class CustomRatelimitError extends HttpException {
    constructor(message: string, status: number) {
        super(message, status);
    }
}