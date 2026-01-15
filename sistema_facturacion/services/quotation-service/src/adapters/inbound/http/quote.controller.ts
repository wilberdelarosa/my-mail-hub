import { Controller, Post, Body, Get, Param, ValidationPipe, UsePipes, Injectable, Inject, Delete, Put } from '@nestjs/common';
import { CreateQuoteDto } from './dtos/quote.dto';
import { CreateQuoteUseCase } from '../../../application/use-cases/create-quote.usecase';
import { ApproveQuoteUseCase } from '../../../application/use-cases/approve-quote.usecase';
import { UpdateQuoteUseCase } from '../../../application/use-cases/update-quote.usecase';
import { QuoteRepositoryPort } from '../../../domain/ports/outbound/quote-repository.port';

@Controller('quotes')
export class QuoteController {
    constructor(
        private readonly createQuoteUseCase: CreateQuoteUseCase,
        private readonly approveQuoteUseCase: ApproveQuoteUseCase,
        private readonly updateQuoteUseCase: UpdateQuoteUseCase,
        @Inject(QuoteRepositoryPort)
        private readonly repository: QuoteRepositoryPort
    ) { }

    @Post()
    async create(@Body() dto: CreateQuoteDto) {
        return this.createQuoteUseCase.execute(dto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: CreateQuoteDto) {
        return this.updateQuoteUseCase.execute(id, dto);
    }

    @Get()
    async findAll() {
        return this.repository.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.repository.findById(id);
    }

    @Post(':id/approve')
    async approve(@Param('id') id: string) {
        await this.approveQuoteUseCase.execute(id);
        return { success: true, message: 'Cotización aprobada' };
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.repository.delete(id);
    }
}
