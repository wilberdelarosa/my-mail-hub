"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const identity_module_1 = require("./infrastructure/modules/identity.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(identity_module_1.IdentityModule);
    app.setGlobalPrefix('api/identity/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Identity & Access API')
        .setDescription('Microservicio de autenticación y autorización - ALITO GROUP')
        .setVersion('1.0')
        .addTag('Authentication', 'Endpoints de autenticación')
        .addTag('Users', 'Gestión de usuarios')
        .addTag('Roles', 'Gestión de roles y permisos')
        .addBearerAuth()
        .setContact('ALITO GROUP SRL', 'https://alitogroup.com', 'dev@alitogroup.com')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
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
//# sourceMappingURL=main.js.map