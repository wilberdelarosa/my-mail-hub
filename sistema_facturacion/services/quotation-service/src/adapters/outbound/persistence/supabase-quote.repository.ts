import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Quote, QuoteStatus } from '../../../domain/entities/quote.entity';
import { QuoteItem } from '../../../domain/entities/quote-item.entity';
import { QuoteRepositoryPort } from '../../../domain/ports/outbound/quote-repository.port';

@Injectable()
export class SupabaseQuoteRepository implements QuoteRepositoryPort {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_KEY || ''
        );
    }

    async save(quote: Quote): Promise<Quote> {
        // 1. Guardar la cabecera de la cotización
        const { data, error } = await this.supabase
            .from('quotes')
            .upsert({
                id: quote.id,
                number: quote.number,
                customer_id: quote.customerId,
                status: quote.status,
                subtotal: quote.subtotal,
                tax_amount: quote.taxAmount,
                total: quote.total,
                total_exempt: quote.totalExempt,
                total_taxable: quote.totalTaxable,
                expiration_date: quote.expirationDate,
                notes: quote.notes,
                updated_at: new Date()
            })
            .select()
            .single();

        if (error) throw new Error(`Error saving quote: ${error.message}`);

        // 2. Guardar los items (borrar anteriores y re-insertar para simplicidad en este MVP)
        await this.supabase.from('quote_items').delete().eq('quote_id', quote.id);

        const itemsToInsert = quote.items.map(item => ({
            id: item.id,
            quote_id: quote.id,
            service_item_id: item.serviceItemId,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            tax_rate: item.taxRate,
            unit: item.unit,
            tax_amount: item.taxAmount,
            total: item.total
        }));

        const { error: itemsError } = await this.supabase
            .from('quote_items')
            .insert(itemsToInsert);

        if (itemsError) throw new Error(`Error saving quote items: ${itemsError.message}`);

        return quote;
    }

    async findById(id: string): Promise<Quote | null> {
        const { data, error } = await this.supabase
            .from('quotes')
            .select('*, items:quote_items(*)')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return this.mapToEntity(data);
    }

    async findAll(): Promise<Quote[]> {
        const { data, error } = await this.supabase
            .from('quotes')
            .select('*, items:quote_items(*)')
            .order('created_at', { ascending: false });

        if (error) throw new Error(`Error fetching quotes: ${error.message}`);
        return (data || []).map(this.mapToEntity);
    }

    async findByCustomerId(customerId: string): Promise<Quote[]> {
        const { data, error } = await this.supabase
            .from('quotes')
            .select('*, items:quote_items(*)')
            .eq('customer_id', customerId);

        if (error) throw new Error(`Error fetching quotes for customer: ${error.message}`);
        return (data || []).map(this.mapToEntity);
    }

    async getNextSequence(): Promise<number> {
        const { data, error } = await this.supabase
            .from('quotes')
            .select('id', { count: 'exact', head: true });

        return (data?.length || 0) + 1;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('quotes')
            .delete()
            .eq('id', id);

        if (error) throw new Error(`Error deleting quote: ${error.message}`);
    }

    private mapToEntity(data: any): Quote {
        const items = (data.items || []).map((item: any) => new QuoteItem(
            item.id,
            item.service_item_id,
            item.description,
            item.quantity,
            item.unit_price,
            item.tax_rate,
            item.unit
        ));

        return new Quote(
            data.id,
            data.number,
            data.customer_id,
            items,
            data.status as QuoteStatus,
            new Date(data.created_at),
            new Date(data.expiration_date),
            data.subtotal,
            data.tax_amount,
            data.total,
            data.total_exempt || 0,
            data.total_taxable || 0,
            data.notes
        );
    }
}
