import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SyncBatchDto } from '../../../application/dto/sync-batch.dto';
import { ProcessSyncBatchUseCase } from '../../../application/use-cases/process-sync.usecase';
import { RetryOutboxUseCase } from '../../../application/use-cases/retry-outbox.usecase';

@ApiTags('Sync')
@Controller()
export class SyncController {
    constructor(
        private readonly processSyncBatch: ProcessSyncBatchUseCase,
        private readonly retryOutbox: RetryOutboxUseCase
    ) { }

    @Get('health')
    @ApiOperation({ summary: 'Health check' })
    health() {
        return { status: 'ok', service: 'offline-sync' };
    }

    @Post('sync')
    @ApiOperation({ summary: 'Procesar batch offline' })
    async sync(@Body() body: SyncBatchDto) {
        return this.processSyncBatch.execute(body);
    }

    @Post('outbox/retry')
    @ApiOperation({ summary: 'Reintentar publicacion de eventos pendientes' })
    async retry() {
        return this.retryOutbox.execute();
    }
}
