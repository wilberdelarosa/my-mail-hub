import { Quote } from '../../entities/quote.entity';

export interface QuoteRepositoryPort {
    save(quote: Quote): Promise<Quote>;
    findById(id: string): Promise<Quote | null>;
    findAll(): Promise<Quote[]>;
    findByCustomerId(customerId: string): Promise<Quote[]>;
    getNextSequence(): Promise<number>;
    delete(id: string): Promise<void>;
}

export const QuoteRepositoryPort = Symbol('QuoteRepositoryPort');
