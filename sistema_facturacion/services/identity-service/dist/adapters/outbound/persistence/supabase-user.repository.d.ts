import { UserRepositoryPort } from '../../../domain/ports/outbound/user-repository.port';
import { User } from '../../../domain/entities/user.entity';
export declare class SupabaseUserRepository implements UserRepositoryPort {
    private supabase;
    constructor();
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    save(user: User): Promise<void>;
    delete(id: string): Promise<void>;
    findAll(page: number, limit: number): Promise<{
        users: User[];
        total: number;
    }>;
    emailExists(email: string): Promise<boolean>;
    private mapToEntity;
}
