export class QuoteItem {
    constructor(
        public readonly id: string,
        public readonly serviceItemId: string,
        public description: string,
        public quantity: number,
        public unitPrice: number,
        public taxRate: number,
        public unit: string = 'PA' // Par, Unidad, etc.
    ) { }

    get subtotal(): number {
        return this.quantity * this.unitPrice;
    }

    get taxAmount(): number {
        return this.subtotal * this.taxRate;
    }

    get total(): number {
        return this.subtotal + this.taxAmount;
    }
}
