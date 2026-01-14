import { Injectable, UnauthorizedException, ForbiddenException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UserRepositoryPort } from '../../domain/ports/outbound/user-repository.port';
import { User } from '../../domain/entities/user.entity';
import bcrypt from 'bcryptjs';

/**
 * LoginUseCase - Caso de uso de autenticación
 * 
 * Implementa la lógica de negocio para el login de usuarios
 */
@Injectable()
export class LoginUseCase {
    constructor(
        @Inject('UserRepositoryPort')
        private readonly userRepository: UserRepositoryPort,
        private readonly jwtService: JwtService
    ) { }

    async execute(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: User;
    }> {
        // 1. Buscar usuario por email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // 2. Validar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // 3. Regla de negocio: Solo usuarios activos pueden autenticarse
        if (!user.canAuthenticate()) {
            throw new ForbiddenException('Usuario desactivado');
        }

        // 4. Generar tokens JWT
        const payload = {
            sub: user.id,
            email: user.email.value,
            roles: user.roles.map((r) => r.name),
        };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '1h',
        });

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
        });

        return {
            accessToken,
            refreshToken,
            user,
        };
    }
}
