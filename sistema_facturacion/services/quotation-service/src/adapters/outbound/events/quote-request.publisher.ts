import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqplib from 'amqplib';

export type QuoteRequestSource = 'MANUAL' | 'WHATSAPP' | 'WEB' | 'AI';

@Injectable()
export class QuoteRequestPublisher implements OnModuleInit {
    private connection: any;
    private channel: any;
    private readonly url = process.env.RABBITMQ_URL || 'amqp://alito:alito_dev_2026@localhost:5672';
    private readonly exchange = 'quotation.requests';

    async onModuleInit() {
        try {
            this.connection = await amqplib.connect(this.url);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.exchange, 'topic', { durable: true });

            await this.channel.assertQueue('quotation.requests.manual', { durable: true });
            await this.channel.assertQueue('quotation.requests.whatsapp', { durable: true });
            await this.channel.assertQueue('quotation.requests.web', { durable: true });
            await this.channel.assertQueue('quotation.requests.ai', { durable: true });

            await this.channel.bindQueue('quotation.requests.manual', this.exchange, 'quotation.requests.manual');
            await this.channel.bindQueue('quotation.requests.whatsapp', this.exchange, 'quotation.requests.whatsapp');
            await this.channel.bindQueue('quotation.requests.web', this.exchange, 'quotation.requests.web');
            await this.channel.bindQueue('quotation.requests.ai', this.exchange, 'quotation.requests.ai');

            console.log('✅ Quotation Requests exchange/queues ready');
        } catch (error) {
            console.error('❌ Quotation Requests setup failed', error);
        }
    }

    async publish(source: QuoteRequestSource, payload: any) {
        if (!this.channel) return;
        const routingKey = `quotation.requests.${source.toLowerCase()}`;
        this.channel.publish(
            this.exchange,
            routingKey,
            Buffer.from(JSON.stringify(payload)),
            { persistent: true }
        );
    }
}
