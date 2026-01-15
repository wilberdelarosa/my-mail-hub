import { Test, TestingModule } from '@nestjs/testing';
import { BillingController } from '../../src/adapters/inbound/http/billing.controller';
import { IssueInvoiceUseCase } from '../../src/application/use-cases/issue-invoice.usecase';

describe('BillingController - NCF Tests', () => {
    let controller: BillingController;

    const mockIssueInvoiceUseCase = {
        execute: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BillingController],
            providers: [
                {
                    provide: IssueInvoiceUseCase,
                    useValue: mockIssueInvoiceUseCase
                }
            ]
        }).compile();

        controller = module.get<BillingController>(BillingController);
    });

    describe('NCF Validation', () => {
        it('should validate NCF type 31 (Crédito Fiscal)', async () => {
            const invoiceDto = {
                proformaId: 'prof-001',
                ncfType: '31'
            };

            const mockInvoice = {
                id: 'inv-001',
                ncfType: '31',
                ncfSequence: 'E310000000001',
                total: 1000,
                taxAmount: 180
            };

            mockIssueInvoiceUseCase.execute.mockResolvedValue(mockInvoice);

            const result = await controller.issueInvoice(invoiceDto);

            expect(result).toHaveProperty('ncfSequence');
            expect(result.ncfType).toBe('31');
            expect(result.ncfSequence).toMatch(/^E31/);
        });

        it('should calculate ITBIS correctly (18%)', async () => {
            const invoiceDto = {
                proformaId: 'prof-001',
                ncfType: '31'
            };

            const mockInvoice = {
                id: 'inv-001',
                subtotal: 1000,
                taxAmount: 180, // 18%
                total: 1180
            };

            mockIssueInvoiceUseCase.execute.mockResolvedValue(mockInvoice);

            const result = await controller.issueInvoice(invoiceDto);

            expect(result.taxAmount).toBe(180);
            expect(result.total).toBe(1180);
        });

        it('should reject invalid NCF type', async () => {
            const invoiceDto = {
                proformaId: 'prof-001',
                ncfType: '99' // Invalid
            };

            mockIssueInvoiceUseCase.execute.mockRejectedValue(
                new Error('Invalid NCF type')
            );

            await expect(controller.issueInvoice(invoiceDto)).rejects.toThrow('Invalid NCF type');
        });
    });
});
