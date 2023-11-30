import * as process from "process";

export default () => ({
    port: process.env.PORT,
    openAi: {
        apiKey: process.env.OPENAI_API_KEY,
    },
    bookGptService: {
        rateLimitTime: process.env.BOOK_TTL,
    },
    database: {
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        dbName: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT,
    },
    jwtService: {
        secret: process.env.JWT_SECRET,
    },
    discordService: {
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        redirectUri: process.env.DISCORD_REDIRECT_URI,
    }
});