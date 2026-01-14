import { Email } from '../value-objects/email.vo';
import { Role } from './role.entity';

/**
 * User Entity - Dominio
 * 
 * Entidad de dominio que representa un usuario del sistema.
 * NO depende de infraestructura (BD, frameworks, etc.)
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly name: string,
    public roles: Role[],
    public readonly createdAt: Date,
    public isActive: boolean,
    public readonly passwordHash: string
  ) {}

  /**
   * Regla de negocio: Usuario puede tener múltiples roles
   */
  hasRole(roleName: string): boolean {
    return this.roles.some((role) => role.name === roleName);
  }

  /**
   * Regla de negocio: Usuario con rol 'admin' tiene todos los permisos
   */
  hasPermission(permission: string): boolean {
    if (this.hasRole('admin')) {
      return true;
    }

    return this.roles.some((role) => role.hasPermission(permission));
  }

  /**
   * Regla de negocio: Solo usuarios activos pueden autenticarse
   */
  canAuthenticate(): boolean {
    return this.isActive;
  }

  /**
   * Activar usuario
   */
  activate(): void {
    this.isActive = true;
  }

  /**
   * Desactivar usuario
   */
  deactivate(): void {
    this.isActive = false;
  }

  /**
   * Asignar rol al usuario
   */
  assignRole(role: Role): void {
    if (!this.hasRole(role.name)) {
      this.roles.push(role);
    }
  }

  /**
   * Remover rol del usuario
   */
  removeRole(roleName: string): void {
    this.roles = this.roles.filter((role) => role.name !== roleName);
  }

  /**
   * Convertir a objeto plano (para serialización)
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email.value,
      name: this.name,
      roles: this.roles.map((r) => r.name),
      isActive: this.isActive,
      createdAt: this.createdAt,
    };
  }
}
