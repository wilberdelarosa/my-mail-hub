import { IsEmail, IsNotEmpty, IsString, Length, IsEnum, IsNumber, Min } from 'class-validator';
import { FiscalType } from '../../../domain/entities/customer.entity';

export class CreateCustomerDto {
    @IsString()
    @IsNotEmpty()
    @Length(9, 11)
    rnc: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    phone: string;

    @IsString()
    address: string;

    @IsEnum(FiscalType)
    fiscalType: FiscalType;

    @IsNumber()
    @Min(0)
    creditLimit: number;
}
