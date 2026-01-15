import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import * as amqp from 'amqplib';
import { IssueInvoiceUseCase } from '../../../application/use-cases/issue-invoice.usecase';

@Injectable()
export class ProformaCompletedConsumer implements OnModuleInit {
    private readonly url = process.env.RABBITMQ_URL || 'amqp://alito:alito_dev_2026@localhost:5672';

    constructor(
        private readonly issueInvoiceUseCase: IssueInvoiceUseCase
    ) { }

    async onModuleInit() {
        try {
            const connection = await amqp.connect(this.url);
            const channel = await connection.createChannel();

            await channel.assertExchange('proforma', 'topic', { durable: true });
            const q = await channel.assertQueue('billing.proforma.completed', { durable: true });

            await channel.bindQueue(q.queue, 'proforma', 'proforma.completed');

            console.log('📥 Billing Service listening for proforma.completed events...');

            channel.consume(q.queue, async (msg) => {
                if (msg !== null) {
                    const event = JSON.parse(msg.content.toString());
                    await this.handleProformaCompleted(event);
                    channel.ack(msg);
                }
            });
        } catch (error) {
            console.error('❌ Billing Service RabbitMQ Consumer failed', error);
        }
    }

    private async handleProformaCompleted(event: any) {
        console.log(`🧾 Generando Factura Fiscal para Proforma: ${event.proformaId}`);

        try {
            await this.issueInvoiceUseCase.execute({
                customerId: event.customerId,
                items: event.items,
                ncfType: '31' // Crédito Fiscal para negocios B2B
            });
            console.log(`✅ Factura generada automáticamente para Proforma ${event.proformaId}`);

        } catch (error) {
            console.error(`❌ Falló la generación automática de factura: ${error.message}`);
        }
    }
}
