import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(3003); // Port 3003
    console.log('Quotation Service running on port 3003');
}
bootstrap();
