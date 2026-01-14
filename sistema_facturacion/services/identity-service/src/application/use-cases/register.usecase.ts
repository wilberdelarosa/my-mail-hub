import { Injectable, ConflictException, Inject } from '@nestjs/common';
import type { UserRepositoryPort } from '../../domain/ports/outbound/user-repository.port';
import type { EventPublisherPort } from '../../domain/ports/outbound/event-publisher.port';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { Role } from '../../domain/entities/role.entity';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * RegisterUseCase - Caso de uso de registro de usuarios
 * 
 * Crea un nuevo usuario en el sistema
 */
@Injectable()
export class RegisterUseCase {
    constructor(
        @Inject('UserRepositoryPort')
        private readonly userRepository: UserRepositoryPort,
        @Inject('EventPublisherPort')
        private readonly eventPublisher: EventPublisherPort
    ) { }

    async execute(data: {
        email: string;
        password: string;
        name: string;
    }): Promise<User> {
        // 1. Validar que el email no exista
        const emailExists = await this.userRepository.emailExists(data.email);
        if (emailExists) {
            throw new ConflictException('El email ya está registrado');
        }

        // 2. Crear Email Value Object (valida formato)
        const email = new Email(data.email);

        // 3. Hashear contraseña
        const passwordHash = await bcrypt.hash(data.password, 10);

        // 4. Crear entidad User (con rol viewer por defecto)
        const user = new User(
            uuidv4(),
            email,
            data.name,
            [], // Roles vacíos, se asignarán después
            new Date(),
            true, // Activo por defecto
            passwordHash
        );

        // 5. Guardar en repositorio
        await this.userRepository.save(user);

        // 6. Publicar evento de dominio
        await this.eventPublisher.publishUserCreated({
            userId: user.id,
            email: user.email.value,
            roles: user.roles.map((r) => r.name),
        });

        return user;
    }
}
