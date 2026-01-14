import { Permission } from './permission.entity';

/**
 * Role Entity - Dominio
 * 
 * Representa un rol en el sistema (admin, operator, viewer, etc.)
 */
export class Role {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string,
        public readonly permissions: Permission[],
        public readonly createdAt: Date
    ) { }

    /**
     * Verifica si el rol tiene un permiso específico
     */
    hasPermission(permissionName: string): boolean {
        return this.permissions.some((perm) => perm.name === permissionName);
    }

    /**
     * Agregar permiso al rol
     */
    addPermission(permission: Permission): void {
        if (!this.hasPermission(permission.name)) {
            this.permissions.push(permission);
        }
    }

    /**
     * Remover permiso del rol
     */
    removePermission(permissionName: string): void {
        const index = this.permissions.findIndex((p) => p.name === permissionName);
        if (index !== -1) {
            this.permissions.splice(index, 1);
        }
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            permissions: this.permissions.map((p) => p.name),
            createdAt: this.createdAt,
        };
    }
}
