import { Inject, Injectable } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../domain/ports/outbound/customer-repository.port';
import { Customer, FiscalType } from '../../domain/entities/customer.entity';

export interface UpdateCustomerCommand {
    id: string;
    rnc?: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    fiscalType?: FiscalType;
    creditLimit?: number;
    isActive?: boolean;
}

@Injectable()
export class UpdateCustomerUseCase {
    constructor(
        @Inject(CustomerRepositoryPort)
        private readonly customerRepository: CustomerRepositoryPort
    ) { }

    async execute(command: UpdateCustomerCommand): Promise<Customer> {
        const existing = await this.customerRepository.findById(command.id);
        if (!existing) throw new Error('Customer not found');

        const updated = new Customer(
            existing.id,
            command.rnc ?? existing.rnc,
            command.name ?? existing.name,
            command.email ?? existing.email,
            command.phone ?? existing.phone,
            command.address ?? existing.address,
            command.fiscalType ?? existing.fiscalType,
            command.creditLimit ?? existing.creditLimit,
            existing.createdAt,
            command.isActive ?? existing.isActive
        );

        return this.customerRepository.save(updated);
    }
}
