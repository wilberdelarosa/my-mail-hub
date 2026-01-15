import { Inject, Injectable } from '@nestjs/common';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerRepositoryPort } from '../../domain/ports/outbound/customer-repository.port';

@Injectable()
export class GetCustomersUseCase {
    constructor(
        @Inject(CustomerRepositoryPort)
        private readonly customerRepository: CustomerRepositoryPort
    ) { }

    async execute(): Promise<Customer[]> {
        return this.customerRepository.findAll();
    }
}
