import { QuoteItem } from './quote-item.entity';

export enum QuoteStatus {
    DRAFT = 'DRAFT',
    SENT = 'SENT',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED',
    INVOICED = 'INVOICED'
}

export class Quote {
    constructor(
        public readonly id: string,
        public readonly number: string, // Secuencial: COT-2026-0001
        public readonly customerId: string,
        public items: QuoteItem[],
        public status: QuoteStatus,
        public readonly createdAt: Date,
        public expirationDate: Date,
        public subtotal: number,
        public taxAmount: number,
        public total: number,
        public notes?: string
    ) { }

    /**
     * Agregar item a la cotización
     */
    addItem(item: QuoteItem): void {
        if (this.status !== QuoteStatus.DRAFT) {
            throw new Error('Solo se pueden modificar cotizaciones en borrador');
        }
        this.items.push(item);
        this.calculateTotals();
    }

    /**
     * Calcular totales
     */
    calculateTotals(): void {
        this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
        this.taxAmount = this.items.reduce((sum, item) => sum + item.taxAmount, 0);
        this.total = this.subtotal + this.taxAmount;
    }

    /**
     * Aprobar cotización
     */
    approve(): void {
        if (this.status !== QuoteStatus.SENT) {
            // Business rule could be stricter
        }
        this.status = QuoteStatus.APPROVED;
    }

    /**
     * Rechazar cotización
     */
    reject(): void {
        this.status = QuoteStatus.REJECTED;
    }
}
