import { Controller, Get, Inject } from '@nestjs/common';
import { ServiceItemRepositoryPort } from '../../../domain/ports/outbound/service-item-repository.port';

@Controller('service-items')
export class ServiceItemController {
    constructor(
        @Inject(ServiceItemRepositoryPort)
        private readonly repository: ServiceItemRepositoryPort
    ) { }

    @Get()
    async findAll() {
        return this.repository.findAll();
    }
}
