export type QuoteRequestSource = 'MANUAL' | 'WHATSAPP' | 'WEB' | 'AI';

export interface QuoteRequestPayload {
    customerId?: string;
    items?: Array<{
        serviceItemId: string;
        description: string;
        quantity: number;
        unitPrice: number;
        taxRate: number;
        unit?: string;
    }>;
    notes?: string;
    expirationDays?: number;

    // WhatsApp
    from?: string;
    text?: string;
    timestamp?: string;
}

export interface QuoteRequestCommand {
    source: QuoteRequestSource;
    payload: QuoteRequestPayload;
}
