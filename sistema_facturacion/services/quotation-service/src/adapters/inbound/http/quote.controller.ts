import { Controller, Post, Body, Get, Param, ValidationPipe, UsePipes } from '@nestjs/common';
import { CreateQuoteDto } from './dtos/quote.dto';

// Placeholder UseCase
class CreateQuoteUseCase { execute(dto: any) { return { id: 'quote-123', status: 'DRAFT', ...dto }; } }

@Controller('quotes')
export class QuoteController {
    private createQuoteUseCase = new CreateQuoteUseCase();

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() dto: CreateQuoteDto) {
        return this.createQuoteUseCase.execute(dto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return { id, number: 'COT-2026-0001', total: 15000 };
    }
}
