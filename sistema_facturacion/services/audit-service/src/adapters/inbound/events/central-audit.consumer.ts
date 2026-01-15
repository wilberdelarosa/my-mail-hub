import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import * as amqp from 'amqplib';
import { AuditRepositoryPort } from '../../../domain/ports/outbound/audit-repository.port';
import { AuditLog } from '../../../domain/entities/audit-log.entity';

@Injectable()
export class CentralAuditConsumer implements OnModuleInit {
    private readonly url = process.env.RABBITMQ_URL || 'amqp://alito:alito_dev_2026@localhost:5672';

    constructor(
        @Inject(AuditRepositoryPort)
        private readonly auditRepository: AuditRepositoryPort
    ) { }

    async onModuleInit() {
        try {
            const connection = await amqp.connect(this.url);
            const channel = await connection.createChannel();

            // Escuchar todos los exchanges relevantes (billing, identity, etc)
            const exchanges = ['billing', 'identity', 'quotation'];
            const q = await channel.assertQueue('audit.central', { durable: true });

            for (const ex of exchanges) {
                await channel.assertExchange(ex, 'topic', { durable: true });
                await channel.bindQueue(q.queue, ex, '#'); // Escuchar TODO
            }

            console.log('🛡️ Audit Service listening for ALL system events...');

            channel.consume(q.queue, async (msg) => {
                if (msg !== null) {
                    const routingKey = msg.fields.routingKey;
                    const exchange = msg.fields.exchange;
                    const payload = JSON.parse(msg.content.toString());

                    const auditLog = new AuditLog(
                        crypto.randomUUID(),
                        exchange,
                        routingKey.split('.')[0] || 'unknown',
                        routingKey.split('.')[1] || 'action',
                        payload.id || payload.userId || 'system',
                        payload.userId || null,
                        '0.0.0.0', // Could extract from payload if present
                        payload,
                        new Date()
                    );

                    await this.auditRepository.save(auditLog);
                    channel.ack(msg);
                }
            });
        } catch (error) {
            console.error('❌ Audit Service RabbitMQ Consumer failed', error);
        }
    }
}
