export class AuditLog {
    constructor(
        public readonly id: string,
        public readonly service: string,
        public readonly entity: string,
        public readonly action: string, // CREATE, UPDATE, DELETE, LOGIN
        public readonly entityId: string,
        public readonly userId: string,
        public readonly ipAddress: string,
        public readonly payload: any, // JSON con datos cambiados
        public readonly timestamp: Date
    ) { }
}
