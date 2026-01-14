import { Controller, Post, Body, Param, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePaymentDto, ApplyPaymentDto } from './dtos/payment.dto';
import { SupabasePaymentRepository } from '../../outbound/persistence/supabase-payment.repository';
// import { RegisterPaymentUseCase } from '../../../application/use-cases/register-payment.usecase';

// Placeholder UseCase
class RegisterPaymentUseCase {
    execute(dto: any) { return { id: 'pay-123', status: 'POSTED', ...dto }; }
}

@Controller('payments')
export class ArController {
    private registerPaymentUseCase = new RegisterPaymentUseCase();

    constructor(
        private paymentRepo: SupabasePaymentRepository // Inject real repo for future use
    ) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() dto: CreatePaymentDto) {
        return this.registerPaymentUseCase.execute(dto);
    }

    @Post('apply')
    async apply(@Body() dto: ApplyPaymentDto) {
        await this.paymentRepo.applyToInvoice(dto.paymentId, dto.invoiceId, dto.amount);
        return { success: true, message: 'Payment applied successfully' };
    }
}
