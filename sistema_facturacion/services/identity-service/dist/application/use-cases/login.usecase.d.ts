import { JwtService } from '@nestjs/jwt';
import type { UserRepositoryPort } from '../../domain/ports/outbound/user-repository.port';
import { User } from '../../domain/entities/user.entity';
export declare class LoginUseCase {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: UserRepositoryPort, jwtService: JwtService);
    execute(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: User;
    }>;
}
