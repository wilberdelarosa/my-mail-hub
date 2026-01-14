import { Email } from '../value-objects/email.vo';
import { Role } from './role.entity';
export declare class User {
    readonly id: string;
    readonly email: Email;
    readonly name: string;
    roles: Role[];
    readonly createdAt: Date;
    isActive: boolean;
    readonly passwordHash: string;
    constructor(id: string, email: Email, name: string, roles: Role[], createdAt: Date, isActive: boolean, passwordHash: string);
    hasRole(roleName: string): boolean;
    hasPermission(permission: string): boolean;
    canAuthenticate(): boolean;
    activate(): void;
    deactivate(): void;
    assignRole(role: Role): void;
    removeRole(roleName: string): void;
    toJSON(): {
        id: string;
        email: string;
        name: string;
        roles: string[];
        isActive: boolean;
        createdAt: Date;
    };
}
