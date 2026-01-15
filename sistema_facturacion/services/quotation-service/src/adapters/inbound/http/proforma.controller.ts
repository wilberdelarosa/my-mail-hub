import { Controller, Get, Post, Param } from '@nestjs/common';
import { GetProformasUseCase } from '../../../application/use-cases/get-proformas.usecase';
import { CompleteProformaUseCase } from '../../../application/use-cases/complete-proforma.usecase';

import { GetProformaPdfUseCase } from '../../../application/use-cases/get-proforma-pdf.usecase';

@Controller('proformas')
export class ProformaController {
    constructor(
        private readonly getProformasUseCase: GetProformasUseCase,
        private readonly completeProformaUseCase: CompleteProformaUseCase,
        private readonly getProformaPdfUseCase: GetProformaPdfUseCase
    ) { }

    @Get()
    async findAll() {
        return this.getProformasUseCase.execute();
    }

    @Get(':id/pdf')
    async getPdf(@Param('id') id: string) {
        const url = await this.getProformaPdfUseCase.execute(id);
        return { url };
    }

    @Post(':id/complete')
    async complete(@Param('id') id: string) {
        await this.completeProformaUseCase.execute(id);
        return { success: true, message: 'Proforma completada y enviada a facturación' };
    }
}
