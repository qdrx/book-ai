import {ArgumentsHost, Catch, ExceptionFilter} from '@nestjs/common';
import {RatelimitBlockMiddleware} from "../middleware/ratelimit-block.middleware";
import {CustomRatelimitError} from "../common/exceptions/custom-ratelimit.error";
import {Response} from 'express';

@Catch(CustomRatelimitError)
export class RatelimitExceptionFilter implements ExceptionFilter {
    constructor(private readonly rateLimitMiddleware: RatelimitBlockMiddleware) {
    }

    catch(exception: CustomRatelimitError, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        this.rateLimitMiddleware.setLastErrorTime();
        response
            .status(status)
            .json({statusCode: status, message: exception.message});
    }
}