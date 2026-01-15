import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const corsOrigin = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',')
        : 'http://localhost:3000';

    app.enableCors({
        origin: corsOrigin,
        credentials: true,
    });

    app.setGlobalPrefix('api/master-data/v1');

    const port = process.env.PORT || 3002;
    await app.listen(port);
    console.log(`Master Data Service running on port ${port}`);
}
bootstrap();
