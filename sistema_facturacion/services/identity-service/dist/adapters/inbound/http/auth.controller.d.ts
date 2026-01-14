import { LoginUseCase } from '../../../application/use-cases/login.usecase';
import { RegisterUseCase } from '../../../application/use-cases/register.usecase';
import { LoginDto, RegisterDto, LoginResponseDto } from './dtos/auth.dto';
export declare class AuthController {
    private readonly loginUseCase;
    private readonly registerUseCase;
    constructor(loginUseCase: LoginUseCase, registerUseCase: RegisterUseCase);
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            name: string;
            roles: string[];
            isActive: boolean;
            createdAt: Date;
        };
    }>;
}
