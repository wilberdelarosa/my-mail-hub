import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomerController } from './adapters/inbound/http/customer.controller';
import { ServiceItemController } from './adapters/inbound/http/service-item.controller';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.usecase';
import { GetCustomersUseCase } from './application/use-cases/get-customers.usecase';
import { UpdateCustomerUseCase } from './application/use-cases/update-customer.usecase';
import { DeleteCustomerUseCase } from './application/use-cases/delete-customer.usecase';
import { CustomerRepositoryPort } from './domain/ports/outbound/customer-repository.port';
import { SupabaseCustomerRepository } from './adapters/outbound/persistence/supabase-customer.repository';
import { ServiceItemRepositoryPort } from './domain/ports/outbound/service-item-repository.port';
import { SupabaseServiceItemRepository } from './adapters/outbound/persistence/supabase-service-item.repository';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [CustomerController, ServiceItemController],
    providers: [
        CreateCustomerUseCase,
        GetCustomersUseCase,
        UpdateCustomerUseCase,
        DeleteCustomerUseCase,
        {
            provide: CustomerRepositoryPort,
            useClass: SupabaseCustomerRepository,
        },
        {
            provide: ServiceItemRepositoryPort,
            useClass: SupabaseServiceItemRepository,
        }
    ],
})
export class AppModule { }
