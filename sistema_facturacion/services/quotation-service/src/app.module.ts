import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QuoteController } from './adapters/inbound/http/quote.controller';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [QuoteController],
    providers: [],
})
export class AppModule { }
