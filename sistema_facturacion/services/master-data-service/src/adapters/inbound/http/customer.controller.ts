import { Controller, Post, Body, Get, Param, ValidationPipe, UsePipes, Patch, Delete, Put, Inject } from '@nestjs/common';
import { CreateCustomerDto } from './dtos/customer.dto';
import { CreateCustomerUseCase } from '../../../application/use-cases/create-customer.usecase';
import { GetCustomersUseCase } from '../../../application/use-cases/get-customers.usecase';
import { UpdateCustomerUseCase } from '../../../application/use-cases/update-customer.usecase';
import { DeleteCustomerUseCase } from '../../../application/use-cases/delete-customer.usecase';
import { CustomerRepositoryPort } from '../../../domain/ports/outbound/customer-repository.port';

@Controller('customers')
export class CustomerController {
    constructor(
        private readonly createCustomerUseCase: CreateCustomerUseCase,
        private readonly getCustomersUseCase: GetCustomersUseCase,
        private readonly updateCustomerUseCase: UpdateCustomerUseCase,
        private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
        @Inject(CustomerRepositoryPort)
        private readonly customerRepository: CustomerRepositoryPort
    ) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() dto: CreateCustomerDto) {
        return this.createCustomerUseCase.execute(dto);
    }

    @Get()
    async findAll() {
        return this.getCustomersUseCase.execute();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.customerRepository.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: any) {
        return this.updateCustomerUseCase.execute({ id, ...dto });
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.deleteCustomerUseCase.execute(id);
    }
}
