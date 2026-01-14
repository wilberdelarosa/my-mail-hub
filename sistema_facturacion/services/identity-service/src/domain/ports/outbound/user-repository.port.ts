import { User } from '../../entities/user.entity';

/**
 * UserRepositoryPort - Puerto Outbound
 * 
 * Interface que define las operaciones de persistencia de usuarios.
 * Las implementaciones pueden ser: Supabase, PostgreSQL directo, MongoDB, etc.
 */
export interface UserRepositoryPort {
    /**
     * Buscar usuario por email
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Buscar usuario por ID
     */
    findById(id: string): Promise<User | null>;

    /**
     * Guardar usuario (crear o actualizar)
     */
    save(user: User): Promise<void>;

    /**
     * Eliminar usuario
     */
    delete(id: string): Promise<void>;

    /**
     * Listar todos los usuarios (con paginación)
     */
    findAll(page: number, limit: number): Promise<{
        users: User[];
        total: number;
    }>;

    /**
     * Verificar si el email ya existe
     */
    emailExists(email: string): Promise<boolean>;
}
