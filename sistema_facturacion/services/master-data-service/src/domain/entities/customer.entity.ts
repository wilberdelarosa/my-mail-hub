/**
 * Customer Entity - Dominio
 * 
 * Representa un cliente del sistema
 * Regla: RNC/Cédula debe ser único
 */
export class Customer {
    constructor(
        public readonly id: string,
        public readonly rnc: string, // RNC o Cédula
        public name: string,
        public email: string,
        public phone: string,
        public address: string,
        public readonly fiscalType: FiscalType, // Crédito Fiscal, Consumidor, etc.
        public creditLimit: number,
        public readonly createdAt: Date,
        public isActive: boolean
    ) { }

    /**
     * Validar formato RNC (9 dígitos) o Cédula (11 dígitos)
     */
    static isValidRNC(rnc: string): boolean {
        const cleaned = rnc.replace(/[^0-9]/g, '');
        return cleaned.length === 9 || cleaned.length === 11;
    }

    /**
     * Regla: Cliente activo puede comprar
     */
    canPurchase(): boolean {
        return this.isActive;
    }

    /**
     * Regla: Verificar límite de crédito
     */
    hasAvailableCredit(amount: number): boolean {
        return amount <= this.creditLimit;
    }

    deactivate(): void {
        this.isActive = false;
    }

    activate(): void {
        this.isActive = true;
    }
}

export enum FiscalType {
    CREDITO_FISCAL = 'CREDITO_FISCAL', // e-NCF 31
    CONSUMIDOR = 'CONSUMIDOR',         // e-NCF 32
    GUBERNAMENTAL = 'GUBERNAMENTAL',    // e-NCF especial
    ESPECIAL = 'ESPECIAL'              // Regímenes especiales
}
