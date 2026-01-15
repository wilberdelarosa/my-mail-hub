export interface DocumentsServicePort {
    generateProformaPdf(proforma: any): Promise<string>;
}

export const DocumentsServicePort = Symbol('DocumentsServicePort');
