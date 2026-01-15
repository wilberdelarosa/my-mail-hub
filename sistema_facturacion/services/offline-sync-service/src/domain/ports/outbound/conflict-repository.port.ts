export abstract class ConflictRepositoryPort {
    abstract createConflict(payload: {
        entityType: string;
        entityId: string;
        reason: string;
        existingChecksum?: string | null;
        incomingChecksum?: string | null;
        strategy?: string | null;
        payload?: Record<string, any> | null;
    }): Promise<void>;
}
