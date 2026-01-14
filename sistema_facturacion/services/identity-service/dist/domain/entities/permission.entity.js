"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
class Permission {
    id;
    name;
    description;
    resource;
    action;
    constructor(id, name, description, resource, action) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.resource = resource;
        this.action = action;
    }
    get canonical() {
        return `${this.resource}:${this.action}`;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            canonical: this.canonical,
        };
    }
}
exports.Permission = Permission;
//# sourceMappingURL=permission.entity.js.map