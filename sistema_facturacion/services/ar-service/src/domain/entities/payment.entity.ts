export enum PaymentStatus {
    DRAFT = 'DRAFT',
    POSTED = 'POSTED',
    CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
    CASH = 'CASH',
    CREDIT_CARD = 'CREDIT_CARD',
    TRANSFER = 'TRANSFER',
    CHECK = 'CHECK',
    RETENTION = 'RETENTION'
}

export class Payment {
    constructor(
        public readonly id: string,
        public readonly customerId: string,
        public amount: number,
        public unappliedAmount: number, // Monto disponible
        public method: PaymentMethod,
        public reference: string, // Nro Cheque / Transferencia
        public date: Date,
        public status: PaymentStatus
    ) { }

    /**
     * Aplicar monto a una factura
     */
    apply(amountToApply: number): void {
        if (amountToApply > this.unappliedAmount) {
            throw new Error('Monto a aplicar excede el disponible');
        }
        this.unappliedAmount -= amountToApply;
    }
}
