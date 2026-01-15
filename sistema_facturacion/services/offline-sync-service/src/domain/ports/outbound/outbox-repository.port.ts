export abstract class OutboxRepositoryPort {
    abstract enqueue(payload: { eventName: string; payload: Record<string, any> }): Promise<void>;
    abstract getPending(limit: number): Promise<Array<{ id: string; eventName: string; payload: Record<string, any>; attempts: number }>>;
    abstract markSuccess(id: string): Promise<void>;
    abstract markFailed(id: string, error: string): Promise<void>;
}
