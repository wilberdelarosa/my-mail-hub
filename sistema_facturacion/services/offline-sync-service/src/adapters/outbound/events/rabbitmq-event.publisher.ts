import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { EventPublisherPort } from '../../../domain/ports/outbound/event-publisher.port';

@Injectable()
export class RabbitMQEventPublisher implements EventPublisherPort {
    private client: ClientProxy;

    constructor() {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL || 'amqp://alito:alito_dev_2026@localhost:5672'],
                queue: 'offline_sync_events',
                queueOptions: { durable: true },
            },
        });
    }

    async publish(eventName: string, payload: Record<string, any>): Promise<void> {
        await this.client.emit(eventName, payload).toPromise();
    }
}
