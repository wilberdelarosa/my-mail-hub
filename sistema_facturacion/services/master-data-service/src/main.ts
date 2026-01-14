import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(3002); // Puerto diferenciado (Identity=3001)
    console.log('Master Data Service running on port 3002');
}
bootstrap();
