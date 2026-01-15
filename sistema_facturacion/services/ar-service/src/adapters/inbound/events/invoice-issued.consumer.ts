import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import * as amqp from 'amqplib';
import { PaymentRepositoryPort } from '../../../domain/ports/outbound/payment-repository.port';

@Injectable()
export class InvoiceIssuedConsumer implements OnModuleInit {
    private readonly url = process.env.RABBITMQ_URL || 'amqp://alito:alito_dev_2026@localhost:5672';

    constructor(
        @Inject(PaymentRepositoryPort)
        private readonly paymentRepository: PaymentRepositoryPort
    ) { }

    async onModuleInit() {
        try {
            const connection = await amqp.connect(this.url);
            const channel = await connection.createChannel();

            await channel.assertExchange('billing', 'topic', { durable: true });
            const q = await channel.assertQueue('ar.invoice.issued', { durable: true });

            await channel.bindQueue(q.queue, 'billing', 'invoice.issued');

            console.log('📥 AR Service listening for invoice.issued events...');

            channel.consume(q.queue, async (msg) => {
                if (msg !== null) {
                    const event = JSON.parse(msg.content.toString());
                    await this.handleInvoiceIssued(event);
                    channel.ack(msg);
                }
            });
        } catch (error) {
            console.error('❌ AR Service RabbitMQ Consumer failed', error);
        }
    }

    private async handleInvoiceIssued(event: any) {
        console.log(`🧾 Procesando nueva deuda para cliente ${event.customerId} - Factura: ${event.ncf} - Monto: ${event.total}`);

        // Aquí se crearía un registro en una tabla 'accounts_receivable'
        // Por ahora, lo guardamos como un log o preparamos el repositorio
        // TODO: Implementar AccountReceivableRepository
    }
}
