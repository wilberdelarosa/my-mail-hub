export enum NcfType {
    CREDITO_FISCAL = '31', // B01 - Factura de Crédito Fiscal (E-CF)
    CONSUMIDOR_FINAL = '32', // B02 - Factura de Consumo (E-CF)
    NOTA_DE_BITO = '33',     // B03 - Nota de Débito (E-CF)
    NOTA_CR_DITO = '34',     // B04 - Nota de Crédito (E-CF)
    COMPRAS = '41',          // B11 - Compras (E-CF)
    GASTOS_MENORES = '43',   // B13 - Gastos Menores (E-CF)
    REGIMEN_ESPECIAL = '44', // B14 - Regímenes Especiales (E-CF)
    GUBERNAMENTAL = '45'     // B15 - Gubernamental (E-CF)
}

export class eNCF {
    constructor(
        public readonly id: string,
        public readonly type: NcfType,
        public readonly serie: string, // E
        public readonly sequence: string, // 310000000001
        public readonly fullNcf: string, // E310000000001
        public readonly rncEmisor: string,
        public readonly rncComprador: string,
        public readonly securityCode: string, // Código de seguridad DGII
        public readonly expirationDate: Date,
        public status: 'GENERATED' | 'SIGNED' | 'SENT' | 'ACCEPTED' | 'REJECTED'
    ) { }

    /**
     * Verificar si el NCF es válido para crédito fiscal
     */
    isFiscalCredit(): boolean {
        return this.type === NcfType.CREDITO_FISCAL;
    }
}
