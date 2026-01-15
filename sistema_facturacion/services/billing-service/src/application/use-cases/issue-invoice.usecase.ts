import { Inject, Injectable } from '@nestjs/common';
import { Invoice, InvoiceStatus } from '../../domain/entities/invoice.entity';
import { InvoiceRepositoryPort } from '../../domain/ports/outbound/invoice-repository.port';
import { EventPublisherPort } from '../../domain/ports/outbound/event-publisher.port';
import type { InvoiceRepositoryPort as IInvoiceRepositoryPort } from '../../domain/ports/outbound/invoice-repository.port';
import type { EventPublisherPort as IEventPublisherPort } from '../../domain/ports/outbound/event-publisher.port';

export interface IssueInvoiceCommand {
    customerId: string;
    quoteId?: string;
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
        taxRate: number;
    }[];
    ncfType: string; // '31' para Crédito Fiscal, etc.
}

@Injectable()
export class IssueInvoiceUseCase {
    constructor(
        @Inject(InvoiceRepositoryPort)
        private readonly invoiceRepository: IInvoiceRepositoryPort,
        @Inject(EventPublisherPort)
        private readonly eventPublisher: IEventPublisherPort
    ) { }

    async execute(command: IssueInvoiceCommand): Promise<Invoice> {
        // 1. Obtener Siguiente NCF
        const ncf = await this.invoiceRepository.getNextNCF(command.ncfType);

        const subtotal = command.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const taxAmount = command.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate), 0);
        const total = subtotal + taxAmount;

        // 2. Crear Entidad Invoice
        const invoice = new Invoice(
            crypto.randomUUID(),
            command.customerId,
            command.quoteId || null,
            { fullNcf: ncf } as any, // Mock NCF object for now
            InvoiceStatus.ISSUED,
            new Date(),
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days due
            subtotal,
            taxAmount,
            total,
            total // Balance inicial = total
        );

        // 3. Persistir
        await this.invoiceRepository.save(invoice);

        // 4. Publicar Evento
        await this.eventPublisher.publish('billing', 'invoice.issued', {
            invoiceId: invoice.id,
            customerId: invoice.customerId,
            total: invoice.total,
            ncf: ncf,
            issueDate: invoice.issueDate
        });

        return invoice;
    }
}
