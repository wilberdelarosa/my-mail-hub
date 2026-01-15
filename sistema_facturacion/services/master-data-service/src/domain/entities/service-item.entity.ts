/**
 * ServiceItem Entity - Dominio
 * 
 * Representa un servicio/producto que se puede facturar
 */
export class ServiceItem {
    constructor(
        public readonly id: string,
        public code: string, // SKU o código interno
        public name: string,
        public description: string,
        public unitPrice: number,
        public taxRate: number, // ITBIS 18% = 0.18
        public readonly category: string,
        public isActive: boolean,
        public readonly createdAt: Date,
        public unit: string = 'UD',
        public itemType: ServiceItemType = 'SERVICE',
        public currency: string = 'DOP',
        public cost: number = 0,
        public isTaxable: boolean = true,
        public attributes: Record<string, unknown> = {}
    ) { }

    /**
     * Calcular precio con impuesto
     */
    getPriceWithTax(): number {
        return this.unitPrice * (1 + this.taxRate);
    }

    /**
     * Calcular monto de impuesto
     */
    getTaxAmount(quantity: number = 1): number {
        return this.unitPrice * quantity * this.taxRate;
    }

    /**
     * Regla: Solo items activos se pueden facturar
     */
    canBeInvoiced(): boolean {
        return this.isActive && this.unitPrice > 0;
    }
}

export type ServiceItemType = 'PRODUCT' | 'SERVICE' | 'EQUIPMENT' | 'MATERIAL';
