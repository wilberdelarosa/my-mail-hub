import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/offline-sync/v1');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    );

    const corsOrigin = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',')
        : 'http://localhost:3000';

    app.enableCors({
        origin: corsOrigin,
        credentials: true,
    });

    const config = new DocumentBuilder()
        .setTitle('Offline Sync API')
        .setDescription('Microservicio de sincronizacion offline - ALITO GROUP')
        .setVersion('1.0')
        .addTag('Sync')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    const port = process.env.PORT || 3010;
    await app.listen(port);

    console.log(`
========================================
🚀 Offline Sync Service
========================================
Port:         ${port}
API:          http://localhost:${port}/api/offline-sync/v1
Swagger:      http://localhost:${port}/api-docs
Health:       http://localhost:${port}/api/offline-sync/v1/health
========================================
`);
}

bootstrap();
