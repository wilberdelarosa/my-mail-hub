import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IdentityModule } from './infrastructure/modules/identity.module';

/**
 * Bootstrap del microservicio Identity & Access
 * Puerto: 3001
 */
async function bootstrap() {
  const app = await NestFactory.create(IdentityModule);

  // Configurar prefijo global
  app.setGlobalPrefix('api/identity/v1');

  // Habilitar validación global (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Configurar CORS
  const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : 'http://localhost:3000';

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  // Configurar Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Identity & Access API')
    .setDescription('Microservicio de autenticación y autorización - ALITO GROUP')
    .setVersion('1.0')
    .addTag('Authentication', 'Endpoints de autenticación')
    .addTag('Users', 'Gestión de usuarios')
    .addTag('Roles', 'Gestión de roles y permisos')
    .addBearerAuth()
    .setContact(
      'ALITO GROUP SRL',
      'https://alitogroup.com',
      'dev@alitogroup.com'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`
  ========================================
  🚀 Identity & Access Service
  ========================================
  Port:         ${port}
  API:          http://localhost:${port}/api/identity/v1
  Swagger:      http://localhost:${port}/api-docs
  Health:       http://localhost:${port}/health
  ========================================
  `);
}

bootstrap();
