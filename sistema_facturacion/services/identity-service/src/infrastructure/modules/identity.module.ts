import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

// Use Cases
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { RegisterUseCase } from '../../application/use-cases/register.usecase';

// Controllers
import { AuthController } from '../../adapters/inbound/http/auth.controller';

// Repositories & Publishers
import { SupabaseUserRepository } from '../../adapters/outbound/persistence/supabase-user.repository';
import { RabbitMQEventPublisher } from '../../adapters/outbound/events/rabbitmq-event.publisher';

// Ports (tokens de inyección)

/**
 * IdentityModule - Módulo principal del microservicio
 * 
 * Configura la inyección de dependencias siguiendo arquitectura hexagonal:
 * - Use Cases dependen de Ports (interfaces)
 * - Adapters implementan Ports
 * - Controllers usan Use Cases
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'alito-secret-key-2026',
            signOptions: {
                issuer: 'identity-service',
            },
        }),
    ],
    controllers: [
        AuthController,
    ],
    providers: [
        // Use Cases
        LoginUseCase,
        RegisterUseCase,

        // Adaptadores Outbound (implementaciones de Ports)
        {
            provide: 'UserRepositoryPort',
            useClass: SupabaseUserRepository,
        },
        {
            provide: 'EventPublisherPort',
            useClass: RabbitMQEventPublisher,
        },

        // Providers necesarios para inyección en Use Cases
    ],
})
export class IdentityModule { }
