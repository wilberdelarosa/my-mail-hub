import { Injectable } from '@nestjs/common';

interface OfflineBatch {
    batchId: string;
    deviceId: string;
    timestamp: string;
    events: Array<{
        eventType: string;
        entityId: string;
        entityType: string;
        data: any;
        localTimestamp: string;
    }>;
}

interface ProcessResult {
    processed: number;
    conflicts: Array<{ eventId: string; reason: string }>;
}

@Injectable()
export class ProcessOfflineBatchUseCase {
    private processedBatches = new Set<string>(); // In-memory cache for idempotency

    async execute(batch: OfflineBatch): Promise<ProcessResult> {
        // 1. Validación de idempotencia
        if (this.processedBatches.has(batch.batchId)) {
            console.log(`⚠️ Batch ${batch.batchId} already processed (idempotent)`);
            return { processed: 0, conflicts: [] };
        }

        const conflicts: Array<{ eventId: string; reason: string }> = [];
        let processed = 0;

        // 2. Procesar cada evento
        for (const event of batch.events) {
            try {
                await this.processEvent(event);
                processed++;
            } catch (error) {
                conflicts.push({
                    eventId: event.entityId,
                    reason: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }

        // 3. Marcar batch como procesado
        this.processedBatches.add(batch.batchId);

        // 4. Publicar eventos si hubo conflictos
        if (conflicts.length > 0) {
            console.log(`⚠️ ${conflicts.length} conflicts detected in batch ${batch.batchId}`);
            // TODO: Publicar evento ConflictDetected
        }

        return { processed, conflicts };
    }

    private async processEvent(event: any): Promise<void> {
        console.log(`Processing offline event: ${event.eventType} for ${event.entityId}`);

        // Lógica específica por tipo de evento
        switch (event.entityType) {
            case 'quote':
                await this.processQuoteEvent(event);
                break;
            case 'invoice':
                await this.processInvoiceEvent(event);
                break;
            case 'payment':
                await this.processPaymentEvent(event);
                break;
            default:
                console.warn(`Unknown entity type: ${event.entityType}`);
        }
    }

    private async processQuoteEvent(event: any): Promise<void> {
        // TODO: Validar y guardar cotización offline
        console.log(`Quote event processed: ${event.entityId}`);
    }

    private async processInvoiceEvent(event: any): Promise<void> {
        // TODO: Validar y guardar factura offline
        console.log(`Invoice event processed: ${event.entityId}`);
    }

    private async processPaymentEvent(event: any): Promise<void> {
        // TODO: Validar y guardar pago offline
        console.log(`Payment event processed: ${event.entityId}`);
    }
}
