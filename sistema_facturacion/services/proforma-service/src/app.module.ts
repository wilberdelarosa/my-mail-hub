import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [], // Por implementar Controllers
    providers: [],
})
export class AppModule { }
