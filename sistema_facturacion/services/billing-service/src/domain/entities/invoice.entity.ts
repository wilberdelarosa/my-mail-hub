import { eNCF } from './encf.entity';

export enum InvoiceStatus {
    DRAFT = 'DRAFT',
    ISSUED = 'ISSUED', // Emitida internamente
    SIGNED = 'SIGNED', // Firmada digitalmente
    SENT_DGII = 'SENT_DGII', // Enviada a DGII
    ACCEPTED = 'ACCEPTED', // Aceptada por DGII
    REJECTED = 'REJECTED', // Rechazada por DGII
    CANCELLED = 'CANCELLED', // Anulada
    PAID = 'PAID',
    PARTIALLY_PAID = 'PARTIALLY_PAID'
}

export class Invoice {
    constructor(
        public readonly id: string,
        public readonly customerId: string,
        public readonly quoteId: string | null, // Origen opcional
        public encf: eNCF | null, // NCF asignado
        public status: InvoiceStatus,
        public issueDate: Date,
        public dueDate: Date,
        public subtotal: number,
        public taxAmount: number,
        public total: number,
        public balance: number // Monto pendiente de pago
    ) { }

    /**
     * Asignar NCF a la factura
     */
    assignNCF(ncf: eNCF): void {
        if (this.status !== InvoiceStatus.DRAFT) {
            throw new Error('Solo se puede asignar NCF a facturas en borrador');
        }
        this.encf = ncf;
        this.status = InvoiceStatus.ISSUED;
    }

    /**
     * Registrar pago
     */
    registerPayment(amount: number): void {
        if (amount > this.balance) {
            throw new Error('Monto excede el balance pendiente');
        }
        this.balance -= amount;

        if (this.balance === 0) {
            this.status = InvoiceStatus.PAID;
        } else {
            this.status = InvoiceStatus.PARTIALLY_PAID;
        }
    }
}
