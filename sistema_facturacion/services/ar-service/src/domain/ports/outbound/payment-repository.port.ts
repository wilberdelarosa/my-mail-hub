import { Payment } from '../../entities/payment.entity';

export interface PaymentRepositoryPort {
    save(payment: Payment): Promise<void>;
    applyToInvoice(paymentId: string, invoiceId: string, amount: number): Promise<void>;
}

export const PaymentRepositoryPort = Symbol('PaymentRepositoryPort');
