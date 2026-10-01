import { Type } from 'class-transformer';
import {
    IsDateString,
    IsInt,
    IsOptional,
    IsUUID,
    Max,
    Min,
} from 'class-validator';

export class GetTransactionHistoryQueryDto {
    @IsDateString()
    startDate!: string;

    @IsDateString()
    endDate!: string;

    @IsOptional()
    @IsUUID()
    userId?: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    page!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    perPage!: number;
}