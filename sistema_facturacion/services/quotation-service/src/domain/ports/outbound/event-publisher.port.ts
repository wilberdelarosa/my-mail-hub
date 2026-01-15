export interface EventPublisherPort {
    publish(exchange: string, routingKey: string, payload: any): Promise<void>;
}

export const EventPublisherPort = Symbol('EventPublisherPort');
