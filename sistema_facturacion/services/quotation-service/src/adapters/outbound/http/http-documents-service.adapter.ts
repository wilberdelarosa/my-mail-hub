import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentsServicePort } from '../../../domain/ports/outbound/documents-service.port';

@Injectable()
export class HttpDocumentsServiceAdapter implements DocumentsServicePort {
    private readonly documentsServiceUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.documentsServiceUrl = this.configService.get<string>('DOCUMENTS_SERVICE_URL', 'http://localhost:3008/api/documents/v1');
    }

    async generateProformaPdf(proformaData: any): Promise<string> {
        try {
            const response = await fetch(`${this.documentsServiceUrl}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'proforma',
                    entityId: proformaData.proformaId,
                    data: proformaData
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error generating PDF: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
            if (result.success && result.url) {
                return result.url;
            } else {
                throw new Error('Failed to get PDF URL from response');
            }
        } catch (error) {
            console.error('Error contacting Documents Service:', error);
            throw new Error(`Could not generate Proforma PDF: ${error.message}`);
        }
    }
}
