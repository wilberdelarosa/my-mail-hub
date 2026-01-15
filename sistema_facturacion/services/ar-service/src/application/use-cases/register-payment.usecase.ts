import { Inject, Injectable } from '@nestjs/common';
import { Payment, PaymentStatus, PaymentMethod } from '../../domain/entities/payment.entity';
import { PaymentRepositoryPort } from '../../domain/ports/outbound/payment-repository.port';

export interface RegisterPaymentCommand {
    customerId: string;
    amount: number;
    method: string;
    reference?: string;
    invoiceIds?: string[]; // Facturas a las que aplicar inmediatamente
}

@Injectable()
export class RegisterPaymentUseCase {
    constructor(
        @Inject(PaymentRepositoryPort)
        private readonly paymentRepository: PaymentRepositoryPort
    ) { }

    async execute(command: RegisterPaymentCommand): Promise<Payment> {
        const payment = new Payment(
            crypto.randomUUID(),
            command.customerId,
            command.amount,
            command.amount, // Al inicio todo está sin aplicar
            command.method as PaymentMethod,
            command.reference || '',
            new Date(),
            PaymentStatus.POSTED
        );

        await this.paymentRepository.save(payment);

        return payment;
    }
}
