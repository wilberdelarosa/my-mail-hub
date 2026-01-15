import { Inject, Injectable } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../domain/ports/outbound/customer-repository.port';

@Injectable()
export class DeleteCustomerUseCase {
    constructor(
        @Inject(CustomerRepositoryPort)
        private readonly customerRepository: CustomerRepositoryPort
    ) { }

    async execute(id: string): Promise<void> {
        return this.customerRepository.delete(id);
    }
}
