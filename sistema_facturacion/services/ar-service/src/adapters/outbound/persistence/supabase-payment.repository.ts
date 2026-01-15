import { Injectable } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { PaymentRepositoryPort } from '../../../domain/ports/outbound/payment-repository.port';
import { Payment } from '../../../domain/entities/payment.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabasePaymentRepository implements PaymentRepositoryPort {
    private supabase: SupabaseClient;

    constructor(private configService: ConfigService) {
        const url = this.configService.get<string>('SUPABASE_URL');
        const key = this.configService.get<string>('SUPABASE_SERVICE_KEY');

        if (!url || !key) {
            throw new Error('Supabase URL or Key not found in environment');
        }

        this.supabase = createClient(url, key);
    }

    async save(payment: Payment): Promise<void> {
        const { error } = await this.supabase
            .from('payments')
            .insert({
                id: payment.id,
                customer_id: payment.customerId,
                amount: payment.amount,
                unapplied_amount: payment.unappliedAmount,
                method: payment.method,
                reference: payment.reference,
                payment_date: payment.date,
                status: payment.status
            });

        if (error) throw new Error(`Error saving payment: ${error.message}`);
    }

    async applyToInvoice(paymentId: string, invoiceId: string, amount: number): Promise<void> {
        // Usamos el Stored Procedure transaccional que creamos en la migración FASE 7
        const { error } = await this.supabase.rpc('apply_payment', {
            p_payment_id: paymentId,
            p_invoice_id: invoiceId,
            p_amount: amount
        });

        if (error) throw new Error(`Error applying payment: ${error.message}`);
    }
}
