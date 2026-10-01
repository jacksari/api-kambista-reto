import { Type } from 'class-transformer';
import {
    IsEnum,
    IsNumber,
    Max,
    Min,
} from 'class-validator';
import { Currency } from '../../../domain/enums/currency.enum';

export class CreateTransactionRequestDto {
    @IsEnum(Currency)
    monedaOrigen!: Currency;

    @IsEnum(Currency)
    monedaDestino!: Currency;

    @Type(() => Number)
    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'monto must have at most 2 decimal places' },
    )
    @Min(0.01)
    @Max(9_999_999.99)
    monto!: number;
}