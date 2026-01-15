import { Customer } from '../../entities/customer.entity';

export interface CustomerRepositoryPort {
    save(customer: Customer): Promise<Customer>;
    findById(id: string): Promise<Customer | null>;
    findByRnc(rnc: string): Promise<Customer | null>;
    findAll(): Promise<Customer[]>;
    delete(id: string): Promise<void>;
}

export const CustomerRepositoryPort = Symbol('CustomerRepositoryPort');
