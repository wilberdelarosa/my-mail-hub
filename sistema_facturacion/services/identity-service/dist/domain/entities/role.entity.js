"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
class Role {
    id;
    name;
    description;
    permissions;
    createdAt;
    constructor(id, name, description, permissions, createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.permissions = permissions;
        this.createdAt = createdAt;
    }
    hasPermission(permissionName) {
        return this.permissions.some((perm) => perm.name === permissionName);
    }
    addPermission(permission) {
        if (!this.hasPermission(permission.name)) {
            this.permissions.push(permission);
        }
    }
    removePermission(permissionName) {
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
exports.Role = Role;
//# sourceMappingURL=role.entity.js.map