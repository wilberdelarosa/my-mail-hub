import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserRepositoryPort } from '../../../domain/ports/outbound/user-repository.port';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { Role } from '../../../domain/entities/role.entity';
import { Permission } from '../../../domain/entities/permission.entity';

/**
 * SupabaseUserRepository - Adaptador Outbound
 * 
 * Implementa persistencia de usuarios usando Supabase
 */
@Injectable()
export class SupabaseUserRepository implements UserRepositoryPort {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL || 'http://localhost:54321',
            process.env.SUPABASE_SERVICE_KEY || 'your-service-key'
        );
    }

    async findByEmail(email: string): Promise<User | null> {
        const { data, error } = await this.supabase
            .from('users')
            .select(`
        *,
        user_roles (
          role:roles (
            *,
            role_permissions (
              permission:permissions (*)
            )
          )
        )
      `)
            .eq('email', email)
            .single();

        if (error || !data) {
            return null;
        }

        return this.mapToEntity(data);
    }

    async findById(id: string): Promise<User | null> {
        const { data, error } = await this.supabase
            .from('users')
            .select(`
        *,
        user_roles (
          role:roles (
            *,
            role_permissions (
              permission:permissions (*)
            )
          )
        )
      `)
            .eq('id', id)
            .single();

        if (error || !data) {
            return null;
        }

        return this.mapToEntity(data);
    }

    async save(user: User): Promise<void> {
        const { error } = await this.supabase
            .from('users')
            .upsert({
                id: user.id,
                email: user.email.value,
                name: user.name,
                password_hash: user.passwordHash,
                is_active: user.isActive,
                created_at: user.createdAt,
                updated_at: new Date(),
            });

        if (error) {
            throw new Error(`Failed to save user: ${error.message}`);
        }
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }

    async findAll(page: number, limit: number): Promise<{
        users: User[];
        total: number;
    }> {
        const offset = (page - 1) * limit;

        const { data, error, count } = await this.supabase
            .from('users')
            .select(`
        *,
        user_roles (
          role:roles (
            *,
            role_permissions (
              permission:permissions (*)
            )
          )
        )
      `, { count: 'exact' })
            .range(offset, offset + limit - 1);

        if (error) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }

        return {
            users: data?.map(this.mapToEntity) || [],
            total: count || 0,
        };
    }

    async emailExists(email: string): Promise<boolean> {
        const { data } = await this.supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        return !!data;
    }

    /**
     * Mapea datos de BD a entidad de dominio
     */
    private mapToEntity(data: any): User {
        const roles = data.user_roles?.map((ur: any) => {
            const permissions = ur.role.role_permissions?.map((rp: any) =>
                new Permission(
                    rp.permission.id,
                    rp.permission.name,
                    rp.permission.description,
                    rp.permission.resource,
                    rp.permission.action
                )
            ) || [];

            return new Role(
                ur.role.id,
                ur.role.name,
                ur.role.description,
                permissions,
                new Date(ur.role.created_at)
            );
        }) || [];

        return new User(
            data.id,
            new Email(data.email),
            data.name,
            roles,
            new Date(data.created_at),
            data.is_active,
            data.password_hash
        );
    }
}
