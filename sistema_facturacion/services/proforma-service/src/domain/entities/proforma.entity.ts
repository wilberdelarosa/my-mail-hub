export class Proforma {
    constructor(
        public readonly id: string,
        public readonly quoteId: string,
        public readonly customerId: string,
        public status: 'OPEN' | 'PARTIALLY_DELIVERED' | 'CLOSED',
        public items: ProformaItem[],
        public deliveryRecords: DeliveryRecord[],
        public readonly createdAt: Date
    ) { }

    addDelivery(record: DeliveryRecord): void {
        if (this.status === 'CLOSED') throw new Error('Proforma is closed');
        this.deliveryRecords.push(record);
        // Lógica para cerrar si se entregó todo (simplificada)
    }
}

export class ProformaItem {
    constructor(
        public readonly serviceItemId: string,
        public readonly quantity: number, // Cantidad original comprometida
        public deliveredQuantity: number  // Cantidad ya entregada
    ) { }
}

export class DeliveryRecord {
    constructor(
        public readonly id: string,
        public readonly date: Date,
        public readonly deliveredItems: { itemId: string; quantity: number }[]
    ) { }
}
