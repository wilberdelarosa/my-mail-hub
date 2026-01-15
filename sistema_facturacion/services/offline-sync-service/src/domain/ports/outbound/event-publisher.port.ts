export abstract class EventPublisherPort {
    abstract publish(eventName: string, payload: Record<string, any>): Promise<void>;
}
