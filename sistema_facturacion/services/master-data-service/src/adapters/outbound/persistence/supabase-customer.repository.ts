import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Customer, FiscalType } from '../../../domain/entities/customer.entity';
import { CustomerRepositoryPort } from '../../../domain/ports/outbound/customer-repository.port';

@Injectable()
export class SupabaseCustomerRepository implements CustomerRepositoryPort {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_KEY || ''
        );
    }

    async save(customer: Customer): Promise<Customer> {
        const { data, error } = await this.supabase
            .from('customers')
            .upsert({
                id: customer.id,
                rnc: customer.rnc,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                fiscal_type: customer.fiscalType,
                credit_limit: customer.creditLimit,
                is_active: customer.isActive,
                updated_at: new Date()
            })
            .select()
            .single();

        if (error) throw new Error(`Error saving customer: ${error.message}`);
        return this.mapToEntity(data);
    }

    async findById(id: string): Promise<Customer | null> {
        const { data, error } = await this.supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return this.mapToEntity(data);
    }

    async findByRnc(rnc: string): Promise<Customer | null> {
        const { data, error } = await this.supabase
            .from('customers')
            .select('*')
            .eq('rnc', rnc)
            .single();

        if (error || !data) return null;
        return this.mapToEntity(data);
    }

    async findAll(): Promise<Customer[]> {
        const { data, error } = await this.supabase
            .from('customers')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw new Error(`Error fetching customers: ${error.message}`);
        return (data || []).map(this.mapToEntity);
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('customers')
            .delete()
            .eq('id', id);

        if (error) throw new Error(`Error deleting customer: ${error.message}`);
    }

    private mapToEntity(data: any): Customer {
        return new Customer(
            data.id,
            data.rnc,
            data.name,
            data.email,
            data.phone,
            data.address,
            data.fiscal_type as FiscalType,
            Number(data.credit_limit),
            new Date(data.created_at),
            data.is_active
        );
    }
}
