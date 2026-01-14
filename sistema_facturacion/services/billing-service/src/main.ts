import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(3004); // Port 3004
    console.log('Billing Service running on port 3004');
}
bootstrap();
