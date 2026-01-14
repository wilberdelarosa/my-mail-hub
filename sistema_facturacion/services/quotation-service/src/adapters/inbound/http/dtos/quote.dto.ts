import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class QuoteItemDto {
    @IsString()
    serviceItemId: string;

    @IsString()
    description: string;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsNumber()
    unitPrice: number;
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
