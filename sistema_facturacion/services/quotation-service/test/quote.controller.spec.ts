import { Test, TestingModule } from '@nestjs/testing';
import { QuoteController } from '../../src/adapters/inbound/http/quote.controller';
import { CreateQuoteUseCase } from '../../src/application/use-cases/create-quote.usecase';
import { QuoteRepositoryPort } from '../../src/domain/ports/outbound/quote-repository.port';

describe('QuoteController', () => {
    let controller: QuoteController;
    let createQuoteUseCase: CreateQuoteUseCase;

    const mockQuoteRepository = {
        save: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [QuoteController],
            providers: [
                CreateQuoteUseCase,
                {
                    provide: QuoteRepositoryPort,
                    useValue: mockQuoteRepository
                }
            ]
        }).compile();

        controller = module.get<QuoteController>(QuoteController);
        createQuoteUseCase = module.get<CreateQuoteUseCase>(CreateQuoteUseCase);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('GET /quotes', () => {
        it('should return array of quotes', async () => {
            const mockQuotes = [
                {
                    id: 'quote-1',
                    number: 'COT-2026-0001',
                    customerName: 'Test Cliente',
                    total: 1000,
                    status: 'DRAFT'
                }
            ];

            mockQuoteRepository.findAll.mockResolvedValue(mockQuotes);

            const result = await controller.getAllQuotes();
            expect(result).toEqual(mockQuotes);
            expect(mockQuoteRepository.findAll).toHaveBeenCalled();
        });
    });

    describe('POST /quotes', () => {
        it('should create a new quote', async () => {
            const createDto = {
                customerRnc: '101-12345-6',
                customerName: 'Test Cliente',
                items: [
                    {
                        serviceId: 'srv-001',
                        description: 'Test Service',
                        quantity: 1,
                        unitPrice: 1000,
                        unit: 'HR'
                    }
                ]
            };

            const mockSavedQuote = {
                id: 'quote-123',
                ...createDto,
                status: 'DRAFT',
                total: 1000
            };

            mockQuoteRepository.save.mockResolvedValue(mockSavedQuote);

            const result = await controller.createQuote(createDto);
            expect(result).toHaveProperty('id');
            expect(mockQuoteRepository.save).toHaveBeenCalled();
        });

        it('should fail with empty items', async () => {
            const createDto = {
                customerRnc: '101-12345-6',
                customerName: 'Test Cliente',
                items: []
            };

            await expect(controller.createQuote(createDto)).rejects.toThrow();
        });
    });
});
