/**
 * Permission Entity - Dominio
 * 
 * Representa un permiso granular en el sistema
 * Ejemplos: 'quote:create', 'invoice:issue', 'user:delete'
 */
export class Permission {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string,
        public readonly resource: string, // 'quote', 'invoice', 'user'
        public readonly action: string // 'create', 'read', 'update', 'delete'
    ) { }

    /**
     * Formato canónico: resource:action
     */
    get canonical(): string {
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
