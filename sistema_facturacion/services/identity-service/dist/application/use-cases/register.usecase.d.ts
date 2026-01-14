import type { UserRepositoryPort } from '../../domain/ports/outbound/user-repository.port';
import type { EventPublisherPort } from '../../domain/ports/outbound/event-publisher.port';
import { User } from '../../domain/entities/user.entity';
export declare class RegisterUseCase {
    private readonly userRepository;
    private readonly eventPublisher;
    constructor(userRepository: UserRepositoryPort, eventPublisher: EventPublisherPort);
    execute(data: {
        email: string;
        password: string;
        name: string;
    }): Promise<User>;
}
