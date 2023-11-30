import {HttpException, Injectable} from "@nestjs/common";


@Injectable()
export class RatelimitBlockMiddleware {

    use(req: Request, res: Response, next: () => void) {
        console.log(rateLimitBlockTime)
        const currentTime = Date.now();
        const blockLimit = 30 * 1000;
        const timePassed = currentTime - rateLimitBlockTime;
        if (rateLimitBlockTime && timePassed < blockLimit) {
            throw new HttpException("General endpoint ratelimit exceeded", 403);
        }

        next();
    }

    setLastErrorTime() {
        rateLimitBlockTime = Date.now();
    }
}

export let rateLimitBlockTime = null;