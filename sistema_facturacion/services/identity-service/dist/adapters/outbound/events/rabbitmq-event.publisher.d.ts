import { EventPublisherPort } from '../../../domain/ports/outbound/event-publisher.port';
export declare class RabbitMQEventPublisher implements EventPublisherPort {
    private client;
    constructor();
    publish(eventName: string, payload: any): Promise<void>;
    publishUserCreated(payload: {
        userId: string;
        email: string;
        roles: string[];
    }): Promise<void>;
    publishRoleAssigned(payload: {
        userId: string;
        roleName: string;
    }): Promise<void>;
    publishUserDeactivated(payload: {
        userId: string;
        reason?: string;
    }): Promise<void>;
}
