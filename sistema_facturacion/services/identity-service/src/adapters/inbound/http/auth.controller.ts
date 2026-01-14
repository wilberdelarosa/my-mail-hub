import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUseCase } from '../../../application/use-cases/login.usecase';
import { RegisterUseCase } from '../../../application/use-cases/register.usecase';
import { LoginDto, RegisterDto, LoginResponseDto } from './dtos/auth.dto';

/**
 * AuthController - Adaptador HTTP Inbound
 * 
 * Expone endpoints de autenticación vía REST
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly registerUseCase: RegisterUseCase
    ) { }

    /**
     * POST /auth/login
     * Login de usuario con email y contraseña
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Login de usuario',
        description: 'Autentica un usuario y retorna tokens JWT'
    })
    @ApiResponse({
        status: 200,
        description: 'Login exitoso',
        type: LoginResponseDto
    })
    @ApiResponse({
        status: 401,
        description: 'Credenciales inválidas'
    })
    @ApiResponse({
        status: 403,
        description: 'Usuario desactivado'
    })
    async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
        const result = await this.loginUseCase.execute(
            loginDto.email,
            loginDto.password
        );

        return {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user.toJSON(),
        };
    }

    /**
     * POST /auth/register
     * Registro de nuevo usuario
     */
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Registrar nuevo usuario',
        description: 'Crea un nuevo usuario en el sistema'
    })
    @ApiResponse({
        status: 201,
        description: 'Usuario creado exitosamente'
    })
    @ApiResponse({
        status: 409,
        description: 'El email ya está registrado'
    })
    async register(@Body() registerDto: RegisterDto) {
        const user = await this.registerUseCase.execute(registerDto);

        return {
            message: 'Usuario creado exitosamente',
            user: user.toJSON(),
        };
    }
}
