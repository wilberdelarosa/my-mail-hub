import { Controller, Post, Body, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePaymentDto, ApplyPaymentDto } from './dtos/payment.dto';
import { RegisterPaymentUseCase } from '../../../application/use-cases/register-payment.usecase';
import { SupabasePaymentRepository } from '../../outbound/persistence/supabase-payment.repository';

@Controller('payments')
export class ArController {
    constructor(
        private readonly registerPaymentUseCase: RegisterPaymentUseCase,
        private readonly paymentRepo: SupabasePaymentRepository
    ) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() dto: CreatePaymentDto) {
        return this.registerPaymentUseCase.execute(dto);
    }

    @Post('apply')
    @UsePipes(new ValidationPipe({ transform: true }))
    async apply(@Body() dto: ApplyPaymentDto) {
        await this.paymentRepo.applyToInvoice(dto.paymentId, dto.invoiceId, dto.amount);
        return { success: true, message: 'Pago aplicado exitosamente' };
    }

    @Get()
    async findAll() {
        // Podríamos implementar un GetPaymentsUseCase, pero por ahora directo al repo o mock
        return [];
    }
}
