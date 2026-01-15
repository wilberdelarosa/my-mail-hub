import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateQuoteUseCase } from '../../../application/use-cases/create-quote.usecase';
import { CreateQuoteDto } from './dtos/quote.dto';

@Controller('quotation/v1/manual')
export class ManualQuotationController {
    constructor(private readonly createQuoteUseCase: CreateQuoteUseCase) { }

    @Post()
    async createManual(@Body() dto: CreateQuoteDto) {
        // En un escenario real, aquí validaríamos permisos 'quote:create'
        return this.createQuoteUseCase.execute(dto);
    }
}
