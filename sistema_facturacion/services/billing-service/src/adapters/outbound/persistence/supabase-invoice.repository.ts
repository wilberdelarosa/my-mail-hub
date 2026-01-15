import { Injectable } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { InvoiceRepositoryPort } from '../../../domain/ports/outbound/invoice-repository.port';
import { Invoice, InvoiceStatus } from '../../../domain/entities/invoice.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseInvoiceRepository implements InvoiceRepositoryPort {
    private supabase: SupabaseClient;

    constructor(private configService: ConfigService) {
        this.supabase = createClient(
            this.configService.get<string>('SUPABASE_URL') || '',
            this.configService.get<string>('SUPABASE_SERVICE_KEY') || '',
        );
    }

    async getNextNCF(type: string): Promise<string> {
        const { data, error } = await this.supabase.rpc('get_next_ncf', { p_type: type });

        if (error) throw new Error(`Error generating NCF: ${error.message}`);
        return data;
    }

    async save(invoice: Invoice): Promise<void> {
        const { error } = await this.supabase
            .from('invoices')
            .upsert({
                id: invoice.id,
                customer_id: invoice.customerId,
                quote_id: invoice.quoteId,
                ncf_sequence: invoice.encf?.fullNcf,
                status: invoice.status,
                issue_date: invoice.issueDate,
                due_date: invoice.dueDate,
                subtotal: invoice.subtotal,
                tax_amount: invoice.taxAmount,
                total: invoice.total,
                balance: invoice.balance
            });

        if (error) throw new Error(`Error saving invoice: ${error.message}`);
    }

    async findById(id: string): Promise<Invoice | null> {
        const { data, error } = await this.supabase
            .from('invoices')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;

        // Mapping simple (debería usar un Mapper class)
        return new Invoice(
            data.id,
            data.customer_id,
            data.quote_id,
            null, // NCF object would need reconstruction
            data.status as InvoiceStatus,
            new Date(data.issue_date),
            new Date(data.due_date),
            data.subtotal,
            data.tax_amount,
            data.total,
            data.balance
        );
    }
}
