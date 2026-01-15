import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CORS
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3002'],
        credentials: true,
    });

    // Global prefix
    app.setGlobalPrefix('api/analytics/v1');

    const PORT = process.env.PORT || 3010;
    await app.listen(PORT);

    console.log(`🚀 Analytics Service running on http://localhost:${PORT}/api/analytics/v1`);
    console.log(`📊 KPIs: http://localhost:${PORT}/api/analytics/v1/kpis`);
    console.log(`📈 Dashboard: http://localhost:${PORT}/api/analytics/v1/dashboard`);
}

bootstrap();
