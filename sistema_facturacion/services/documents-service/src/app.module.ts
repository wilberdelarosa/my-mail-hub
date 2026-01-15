
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileStoragePort } from './domain/ports/outbound/file-storage.port';
import { SupabaseStorageAdapter } from './adapters/outbound/storage/supabase-storage.adapter';
import { TemplateEnginePort } from './domain/ports/outbound/template-engine.port';
import { HandlebarsTemplateEngine } from './adapters/outbound/templates/handlebars-template-engine.adapter';

import { DocumentsController } from './adapters/inbound/http/documents.controller';
import { GenerateDocumentUseCase } from './application/use-cases/generate-document.usecase';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [DocumentsController],
    providers: [
        GenerateDocumentUseCase,
        {
            provide: FileStoragePort,
            useClass: SupabaseStorageAdapter,
        },
        {
            provide: TemplateEnginePort,
            useClass: HandlebarsTemplateEngine,
        },
    ],
})
export class AppModule { }
