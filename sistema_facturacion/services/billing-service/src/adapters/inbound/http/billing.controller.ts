import { Controller, Post, Body, Get, Param, ValidationPipe, UsePipes } from '@nestjs/common';
import { CreateInvoiceDto } from './dtos/invoice.dto';

// Placeholder UseCase
class IssueInvoiceUseCase {
    execute(dto: any) {
        return {
            id: 'inv-123',
            ncf: 'E3100000001',
            status: 'ISSUED',
            total: 23600
        };
    }
}

@Controller('invoices')
export class BillingController {
    private issueInvoiceUseCase = new IssueInvoiceUseCase();

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() dto: CreateInvoiceDto) {
        return this.issueInvoiceUseCase.execute(dto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return { id, ncf: 'E3100000001', status: 'ISSUED' };
    }
}
