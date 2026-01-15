import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

    app.setGlobalPrefix('api/documents/v1');

    const config = new DocumentBuilder()
        .setTitle('Documents Service')
        .setDescription('Microservicio de Generación de Documentos (PDF)')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/documents/docs', app, document);

    const port = process.env.PORT || 3008;
    await app.listen(port);
    console.log(`Documents Service running on port ${port}`);
}
bootstrap();
