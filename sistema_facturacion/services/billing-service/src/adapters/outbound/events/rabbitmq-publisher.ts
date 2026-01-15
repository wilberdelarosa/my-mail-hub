import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqplib from 'amqplib';
import { EventPublisherPort } from '../../../domain/ports/outbound/event-publisher.port';

@Injectable()
export class RabbitMQPublisher implements EventPublisherPort, OnModuleInit {
    private connection: any; // amqplib.Connection type has issues with createChannel
    private channel: any; // using any as workaround
    private readonly url = process.env.RABBITMQ_URL || 'amqp://alito:alito_dev_2026@localhost:5672';

    async onModuleInit() {
        try {
            this.connection = await amqplib.connect(this.url);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange('billing', 'topic', { durable: true });
            console.log('✅ Billing Service connected to RabbitMQ');
        } catch (error) {
            console.error('❌ Billing Service RabbitMQ connection failed', error);
        }
    }

    async publish(exchange: string, routingKey: string, payload: any): Promise<void> {
        if (!this.channel) return;
        this.channel.publish(
            exchange,
            routingKey,
            Buffer.from(JSON.stringify(payload)),
            { persistent: true }
        );
    }
}
