import { Invoice } from '../../entities/invoice.entity';
import { eNCF } from '../../entities/encf.entity';

export interface InvoiceRepositoryPort {
    save(invoice: Invoice): Promise<void>;
    findById(id: string): Promise<Invoice | null>;
    getNextNCF(type: string): Promise<string>; // E3100000001
}

export const InvoiceRepositoryPort = Symbol('InvoiceRepositoryPort');
