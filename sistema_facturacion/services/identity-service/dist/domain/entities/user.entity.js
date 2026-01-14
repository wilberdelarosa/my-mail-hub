"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    id;
    email;
    name;
    roles;
    createdAt;
    isActive;
    passwordHash;
    constructor(id, email, name, roles, createdAt, isActive, passwordHash) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.roles = roles;
        this.createdAt = createdAt;
        this.isActive = isActive;
        this.passwordHash = passwordHash;
    }
    hasRole(roleName) {
        return this.roles.some((role) => role.name === roleName);
    }
    hasPermission(permission) {
        if (this.hasRole('admin')) {
            return true;
        }
        return this.roles.some((role) => role.hasPermission(permission));
    }
    canAuthenticate() {
        return this.isActive;
    }
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
    assignRole(role) {
        if (!this.hasRole(role.name)) {
            this.roles.push(role);
        }
    }
    removeRole(roleName) {
        this.roles = this.roles.filter((role) => role.name !== roleName);
    }
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
exports.User = User;
//# sourceMappingURL=user.entity.js.map