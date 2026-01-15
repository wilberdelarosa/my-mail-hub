import { Inject, Injectable } from '@nestjs/common';
import { TemplateEnginePort } from '../../domain/ports/outbound/template-engine.port';
import { FileStoragePort } from '../../domain/ports/outbound/file-storage.port';

export interface GenerateDocumentCommand {
    type: 'quotation' | 'invoice' | 'proforma';
    entityId: string;
    data: any;
}

@Injectable()
export class GenerateDocumentUseCase {
    constructor(
        @Inject(TemplateEnginePort)
        private readonly templateEngine: TemplateEnginePort,
        @Inject(FileStoragePort)
        private readonly fileStorage: FileStoragePort
    ) { }

    async execute(command: GenerateDocumentCommand): Promise<string> {
        // 1. Render HTML
        const html = await this.templateEngine.render(command.type, command.data);

        // 2. Generate PDF
        const pdfBuffer = await this.templateEngine.generatePdf(html);

        // 3. Upload to Storage
        const fileName = `${command.type}/${command.entityId}_${Date.now()}.pdf`;
        const path = await this.fileStorage.upload(fileName, pdfBuffer);

        // 4. Return Public URL (or signed)
        return this.fileStorage.getSignedUrl(path);
    }
}
