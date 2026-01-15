import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3002'],
        credentials: true,
    });

    app.setGlobalPrefix('api/billing/v1');

    // Swagger Configuration
    const config = new DocumentBuilder()
        .setTitle('Billing Service API')
        .setDescription('API para facturación, NCF y cálculo de impuestos - ALITO GROUP')
        .setVersion('1.0')
        .addTag('billing', 'Gestión de facturas')
        .addTag('ncf', 'Gestión de NCF (Comprobantes Fiscales)')
        .addTag('e-ncf', 'e-NCF (Comprobantes Electrónicos DGII)')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/billing/docs', app, document);

    const PORT = process.env.PORT || 3004;
    await app.listen(PORT);

    console.log(`🚀 Billing Service running on http://localhost:${PORT}/api/billing/v1`);
    console.log(`📚 Swagger Docs: http://localhost:${PORT}/api/billing/docs`);
}

bootstrap();
