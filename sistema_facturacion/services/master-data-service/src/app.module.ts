import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomerController } from './adapters/inbound/http/customer.controller';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [CustomerController],
    providers: [],
})
export class AppModule { }
