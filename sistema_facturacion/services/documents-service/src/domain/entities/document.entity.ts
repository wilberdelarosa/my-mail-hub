export enum DocumentType {
    QUOTATION = 'QUOTATION',
    PROFORMA = 'PROFORMA',
    INVOICE = 'INVOICE'
}

export class Document {
    constructor(
        public readonly id: string,
        public readonly entityId: string, // ID de la Cotización/Factura
        public readonly type: DocumentType,
        public readonly fileName: string,
        public readonly url: string,
        public readonly createdAt: Date
    ) { }
}
