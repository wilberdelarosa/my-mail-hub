import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { Customer, FiscalType } from '../../domain/entities/customer.entity';
import { CustomerRepositoryPort } from '../../domain/ports/outbound/customer-repository.port';

export interface CreateCustomerCommand {
    rnc: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    fiscalType: FiscalType;
    creditLimit?: number;
}

@Injectable()
export class CreateCustomerUseCase {
    constructor(
        @Inject(CustomerRepositoryPort)
        private readonly customerRepository: CustomerRepositoryPort
    ) { }

    async execute(command: CreateCustomerCommand): Promise<Customer> {
        // Validar si ya existe un cliente con ese RNC
        const existing = await this.customerRepository.findByRnc(command.rnc);
        if (existing) {
            throw new ConflictException(`Ya existe un cliente con el RNC/Cédula: ${command.rnc}`);
        }

        // Validar formato RNC
        if (!Customer.isValidRNC(command.rnc)) {
            throw new Error('Formato de RNC/Cédula inválido (debe tener 9 u 11 dígitos)');
        }

        const customer = new Customer(
            crypto.randomUUID(),
            command.rnc,
            command.name,
            command.email || '',
            command.phone || '',
            command.address || '',
            command.fiscalType,
            command.creditLimit || 0,
            new Date(),
            true
        );

        return this.customerRepository.save(customer);
    }
}
