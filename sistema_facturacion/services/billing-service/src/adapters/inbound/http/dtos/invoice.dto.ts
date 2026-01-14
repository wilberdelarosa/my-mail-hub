import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateInvoiceDto {
    @IsUUID()
    @IsNotEmpty()
    customerId: string;

    @IsUUID()
    @IsOptional()
    quoteId?: string; // Origen opcional (cotización)

    @IsString()
    @IsNotEmpty()
    ncfType: string; // '31' (Crédito Fiscal) o '32' (Consumo)
}
