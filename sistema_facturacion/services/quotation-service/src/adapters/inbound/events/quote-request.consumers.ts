import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqplib from 'amqplib';
import { ProcessQuoteRequestUseCase } from '../../../application/use-cases/process-quote-request.usecase';

const QUEUES = [
    'quotation.requests.manual',
    'quotation.requests.whatsapp',
    'quotation.requests.web',
    'quotation.requests.ai',
];

@Injectable()
export class QuoteRequestConsumers implements OnModuleInit, OnModuleDestroy {
    private connection: any;
    private channel: any;
    private readonly url = process.env.RABBITMQ_URL || 'amqp://alito:alito_dev_2026@localhost:5672';
    private readonly exchange = 'quotation.requests';

    constructor(private readonly processQuoteRequest: ProcessQuoteRequestUseCase) { }

    async onModuleInit() {
        try {
            this.connection = await amqplib.connect(this.url);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.exchange, 'topic', { durable: true });

            for (const queue of QUEUES) {
                await this.channel.assertQueue(queue, { durable: true });
                await this.channel.bindQueue(queue, this.exchange, queue);
            }

            this.channel.prefetch(10);

            for (const queue of QUEUES) {
                await this.channel.consume(queue, async (msg: any) => {
                    if (!msg) return;
                    try {
                        const payload = JSON.parse(msg.content.toString());
                        const source = queue.split('.').pop()?.toUpperCase() as any;
                        await this.processQuoteRequest.execute({ source, payload });
                        this.channel.ack(msg);
                    } catch (error) {
                        console.error(`❌ Error processing ${queue}`, error);
                        this.channel.nack(msg, false, false);
                    }
                });
            }

            console.log('✅ Quotation Request Consumers ready');
        } catch (error) {
            console.error('❌ Quotation Request Consumers failed', error);
        }
    }

    async onModuleDestroy() {
        try {
            await this.channel?.close();
            await this.connection?.close();
        } catch {
            // ignore
        }
    }
}
