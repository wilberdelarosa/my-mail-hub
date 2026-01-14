import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

/**
 * DTO para Login
 */
export class LoginDto {
    @ApiProperty({
        example: 'admin@alitogroup.com',
        description: 'Email del usuario'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'password123',
        description: 'Contraseña del usuario',
        minLength: 6
    })
    @IsString()
    @MinLength(6)
    password: string;
}

/**
 * DTO para Register
 */
export class RegisterDto {
    @ApiProperty({
        example: 'juan.perez@alitogroup.com',
        description: 'Email del nuevo usuario'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'password123',
        description: 'Contraseña (mínimo 6 caracteres)',
        minLength: 6
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        example: 'Juan Pérez',
        description: 'Nombre completo del usuario'
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}

/**
 * DTO de respuesta de Login
 */
export class LoginResponseDto {
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'Token de acceso (válido por 1 hora)'
    })
    accessToken: string;

    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'Token de refresco (válido por 7 días)'
    })
    refreshToken: string;

    @ApiProperty({
        example: {
            id: 'uuid',
            email: 'admin@alitogroup.com',
            name: 'Admin User',
            roles: ['admin'],
            isActive: true
        },
        description: 'Información del usuario'
    })
    user: any;
}
