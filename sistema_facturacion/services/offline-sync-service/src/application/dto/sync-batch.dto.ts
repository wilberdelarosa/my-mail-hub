import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsISO8601,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested,
    IsObject,
    IsIn,
    ArrayMinSize,
} from 'class-validator';

export class SyncEntityDto {
    @ApiProperty({ description: 'UUID de la entidad creada offline' })
    @IsUUID()
    id!: string;

    @ApiProperty({ description: 'Tipo de entidad', example: 'CUSTOMER' })
    @IsString()
    type!: string;

    @ApiProperty({ description: 'Payload de la entidad' })
    @IsObject()
    payload!: Record<string, any>;

    @ApiProperty({ description: 'Checksum opcional del payload', required: false })
    @IsOptional()
    @IsString()
    checksum?: string;

    @ApiProperty({ description: 'Timestamp de ultima actualizacion en el dispositivo', required: false })
    @IsOptional()
    @IsISO8601()
    updatedAt?: string;
}

export class SyncBatchDto {
    @ApiProperty({ description: 'ID del dispositivo offline' })
    @IsString()
    deviceId!: string;

    @ApiProperty({ description: 'ID del cliente/tenant', required: false })
    @IsOptional()
    @IsString()
    clientId?: string;

    @ApiProperty({ description: 'Timestamp del batch (ISO8601)' })
    @IsISO8601()
    timestamp!: string;

    @ApiProperty({
        description: 'Estrategia de conflicto',
        enum: ['MANUAL', 'CLIENT_WINS', 'SERVER_WINS'],
        required: false,
    })
    @IsOptional()
    @IsIn(['MANUAL', 'CLIENT_WINS', 'SERVER_WINS'])
    conflictStrategy?: 'MANUAL' | 'CLIENT_WINS' | 'SERVER_WINS';

    @ApiProperty({ type: [SyncEntityDto] })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => SyncEntityDto)
    entities!: SyncEntityDto[];
}
