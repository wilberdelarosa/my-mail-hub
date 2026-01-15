import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ServiceItem } from '../../../domain/entities/service-item.entity';
import { ServiceItemRepositoryPort } from '../../../domain/ports/outbound/service-item-repository.port';

@Injectable()
export class SupabaseServiceItemRepository implements ServiceItemRepositoryPort {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_KEY || ''
        );
    }

    async save(item: ServiceItem): Promise<ServiceItem> {
        const { data, error } = await this.supabase
            .from('service_items')
            .upsert({
                id: item.id,
                code: item.code,
                name: item.name,
                description: item.description,
                unit_price: item.unitPrice,
                tax_rate: item.taxRate,
                category: item.category,
                is_active: item.isActive,
                unit: item.unit,
                item_type: item.itemType,
                currency: item.currency,
                cost: item.cost,
                is_taxable: item.isTaxable,
                attributes: item.attributes,
                updated_at: new Date()
            })
            .select()
            .single();

        if (error) throw new Error(`Error saving service item: ${error.message}`);
        return this.mapToEntity(data);
    }

    async findById(id: string): Promise<ServiceItem | null> {
        const { data, error } = await this.supabase
            .from('service_items')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return this.mapToEntity(data);
    }

    async findByCode(code: string): Promise<ServiceItem | null> {
        const { data, error } = await this.supabase
            .from('service_items')
            .select('*')
            .eq('code', code)
            .single();

        if (error || !data) return null;
        return this.mapToEntity(data);
    }

    async findAll(): Promise<ServiceItem[]> {
        const { data, error } = await this.supabase
            .from('service_items')
            .select('*')
            .eq('is_active', true)
            .order('name', { ascending: true });

        if (error) throw new Error(`Error fetching service items: ${error.message}`);
        return (data || []).map(this.mapToEntity);
    }

    private mapToEntity(data: any): ServiceItem {
        return new ServiceItem(
            data.id,
            data.code,
            data.name,
            data.description,
            Number(data.unit_price),
            Number(data.tax_rate),
            data.category,
            data.is_active,
            new Date(data.created_at || new Date()),
            data.unit || 'UD',
            data.item_type || 'SERVICE',
            data.currency || 'DOP',
            Number(data.cost ?? 0),
            data.is_taxable ?? true,
            data.attributes || {}
        );
    }
}
