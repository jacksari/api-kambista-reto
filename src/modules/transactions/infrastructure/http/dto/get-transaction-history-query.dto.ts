import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class GetTransactionHistoryQueryDto {
  @ApiProperty({
    description: 'Start of the transaction date range',
    example: '2026-10-01T00:00:00.000Z',
    format: 'date-time',
  })
  @IsDateString()
  startDate!: string;

  @ApiProperty({
    description: 'End of the transaction date range',
    example: '2026-10-31T23:59:59.999Z',
    format: 'date-time',
  })
  @IsDateString()
  endDate!: string;

  @ApiPropertyOptional({
    description:
      'User whose history is requested; available only to administrators',
    example: '7bcfe595-752a-4ec5-9900-a1846625068f',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page!: number;

  @ApiProperty({ example: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  perPage!: number;
}
