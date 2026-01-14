import { IsNotEmpty, IsString, IsNumber, Min, IsEnum, IsUUID, IsDateString, IsOptional } from 'class-validator';
import { PaymentMethod } from '../../../../domain/entities/payment.entity';

export class CreatePaymentDto {
    @IsUUID()
    @IsNotEmpty()
    customerId: string;

    @IsNumber()
    @Min(1)
    amount: number;

    @IsEnum(PaymentMethod)
    method: PaymentMethod;

    @IsString()
    reference: string;

    @IsDateString()
    date: string;
}

export class ApplyPaymentDto {
    @IsUUID()
    @IsNotEmpty()
    paymentId: string;

    @IsUUID()
    @IsNotEmpty()
    invoiceId: string;

    @IsNumber()
    @Min(0.01)
    amount: number;
}
