import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, Max, Min } from 'class-validator';
import { Currency } from '../../../domain/enums/currency.enum';

export class CreateTransactionRequestDto {
  @ApiProperty({ enum: Currency, example: Currency.USD })
  @IsEnum(Currency)
  monedaOrigen!: Currency;

  @ApiProperty({ enum: Currency, example: Currency.PEN })
  @IsEnum(Currency)
  monedaDestino!: Currency;

  @ApiProperty({
    description: 'Amount to exchange',
    example: 100,
    minimum: 0.01,
    maximum: 9_999_999.99,
  })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'monto must have at most 2 decimal places' },
  )
  @Min(0.01)
  @Max(9_999_999.99)
  monto!: number;
}
