import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class QuoteItemDto {
    @IsString()
    serviceItemId: string;

    @IsString()
    description: string;

    @IsNumber()
    @Min(0.01)
    quantity: number;

    @IsNumber()
    @Min(0)
    unitPrice: number;

    @IsNumber()
    @Min(0)
    taxRate: number;

    @IsString()
    unit?: string;
}

export class CreateQuoteDto {
    @IsString()
    @IsNotEmpty()
    customerId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuoteItemDto)
    items: QuoteItemDto[];

    @IsString()
    notes?: string;
}
