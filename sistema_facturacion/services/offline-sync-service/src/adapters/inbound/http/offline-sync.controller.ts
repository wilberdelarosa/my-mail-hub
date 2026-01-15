import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ProcessOfflineBatchUseCase } from '../../../application/use-cases/process-offline-batch.usecase';

interface OfflineBatchDTO {
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

@Controller('offline-sync')
export class OfflineSyncController {
    constructor(
        private readonly processOfflineBatchUseCase: ProcessOfflineBatchUseCase
    ) { }

    /**
     * POST /api/offline-sync/v1/batch
     * Recibir batch de eventos offline
     */
    @Post('batch')
    @HttpCode(HttpStatus.ACCEPTED)
    async receiveBatch(@Body() batch: OfflineBatchDTO) {
        console.log(`📦 Offline batch received: ${batch.batchId} from ${batch.deviceId}`);

        const result = await this.processOfflineBatchUseCase.execute(batch);

        return {
            success: true,
            batchId: batch.batchId,
            processed: result.processed,
            conflicts: result.conflicts,
            message: `Processed ${result.processed} events, ${result.conflicts.length} conflicts`
        };
    }

    /**
     * POST /api/offline-sync/v1/heartbeat
     * Heartbeat de dispositivos offline
     */
    @Post('heartbeat')
    @HttpCode(HttpStatus.OK)
    async heartbeat(@Body() data: { deviceId: string; lastSyncAt: string }) {
        return {
            success: true,
            deviceId: data.deviceId,
            serverTime: new Date().toISOString(),
            syncRequired: false // Placeholder
        };
    }
}
