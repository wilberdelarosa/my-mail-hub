import { User } from '../../entities/user.entity';
export interface UserRepositoryPort {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    save(user: User): Promise<void>;
    delete(id: string): Promise<void>;
    findAll(page: number, limit: number): Promise<{
        users: User[];
        total: number;
    }>;
    emailExists(email: string): Promise<boolean>;
}
