import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { EventPublisherPort } from '../../../domain/ports/outbound/event-publisher.port';

/**
 * RabbitMQEventPublisher - Adaptador Outbound
 * 
 * Implementa publicación de eventos usando RabbitMQ
 */
@Injectable()
export class RabbitMQEventPublisher implements EventPublisherPort {
    private client: ClientProxy;

    constructor() {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL || 'amqp://alito:alito_dev_2026@localhost:5672'],
                queue: 'identity_events',
                queueOptions: {
                    durable: true,
                },
            },
        });
    }

    async publish(eventName: string, payload: any): Promise<void> {
        await this.client.emit(eventName, payload).toPromise();
    }

    async publishUserCreated(payload: {
        userId: string;
        email: string;
        roles: string[];
    }): Promise<void> {
        await this.publish('identity.user.created', {
            ...payload,
            timestamp: new Date().toISOString(),
        });
    }

    async publishRoleAssigned(payload: {
        userId: string;
        roleName: string;
    }): Promise<void> {
        await this.publish('identity.role.assigned', {
            ...payload,
            timestamp: new Date().toISOString(),
        });
    }

    async publishUserDeactivated(payload: {
        userId: string;
        reason?: string;
    }): Promise<void> {
        await this.publish('identity.user.deactivated', {
            ...payload,
            timestamp: new Date().toISOString(),
        });
    }
}
