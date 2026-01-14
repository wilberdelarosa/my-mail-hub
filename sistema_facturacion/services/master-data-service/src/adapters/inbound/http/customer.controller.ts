import { Controller, Post, Body, Get, Param, ValidationPipe, UsePipes } from '@nestjs/common';
import { CreateCustomerDto } from './dtos/customer.dto';
// import { CreateCustomerUseCase } from '../../../application/use-cases/create-customer.usecase';
// import { GetCustomerUseCase } from '../../../application/use-cases/get-customer.usecase';

// Placeholder para no romper compilación mientras creo los UseCases
class CreateCustomerUseCase { execute(dto: any) { return { id: 'mock-id', ...dto }; } }
class GetCustomerUseCase { execute(id: string) { return { id, name: 'Mock Customer' }; } }

@Controller('customers')
export class CustomerController {
    private createCustomerUseCase = new CreateCustomerUseCase();
    private getCustomerUseCase = new GetCustomerUseCase();

    constructor(
        // private createCustomerUseCase: CreateCustomerUseCase,
        // private getCustomerUseCase: GetCustomerUseCase
    ) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() dto: CreateCustomerDto) {
        return this.createCustomerUseCase.execute(dto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.getCustomerUseCase.execute(id);
    }
}
