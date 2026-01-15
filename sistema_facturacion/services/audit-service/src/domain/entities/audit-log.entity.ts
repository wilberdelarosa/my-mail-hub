export class AuditLog {
    constructor(
        public readonly id: string,
        public readonly service: string,
        public readonly entity: string,
        public readonly action: string,
        public readonly entityId: string,
        public readonly userId: string | null,
        public readonly ipAddress: string,
        public readonly payload: any,
        public readonly timestamp: Date
    ) { }
}
