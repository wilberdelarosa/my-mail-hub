import { Permission } from './permission.entity';
export declare class Role {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly permissions: Permission[];
    readonly createdAt: Date;
    constructor(id: string, name: string, description: string, permissions: Permission[], createdAt: Date);
    hasPermission(permissionName: string): boolean;
    addPermission(permission: Permission): void;
    removePermission(permissionName: string): void;
    toJSON(): {
        id: string;
        name: string;
        description: string;
        permissions: string[];
        createdAt: Date;
    };
}
