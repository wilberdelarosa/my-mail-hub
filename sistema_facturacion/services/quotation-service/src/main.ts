import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CORS
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3002'],
        credentials: true,
    });

    // Global prefix
    app.setGlobalPrefix('api/quotation/v1');

    // Swagger Configuration
    const config = new DocumentBuilder()
        .setTitle('Quotation Service API')
        .setDescription('API para gestión de cotizaciones, proformas y solicitudes multi-canal - ALITO GROUP')
        .setVersion('1.0')
        .addTag('quotation', 'Gestión de cotizaciones')
        .addTag('proforma', 'Gestión de proformas')
        .addTag('webhook', 'Webhooks de ingesta multi-canal')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/quotation/docs', app, document);

    const PORT = process.env.PORT || 3003;
    await app.listen(PORT);

    console.log(`🚀 Quotation Service running on http://localhost:${PORT}/api/quotation/v1`);
    console.log(`📚 Swagger Docs: http://localhost:${PORT}/api/quotation/docs`);
}

bootstrap();
