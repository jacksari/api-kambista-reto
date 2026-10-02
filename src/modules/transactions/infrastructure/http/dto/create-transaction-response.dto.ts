import { ApiProperty } from '@nestjs/swagger';
import { TransactionModel } from 'src/modules/transactions/application/models/transaction.model';
import { Currency } from '../../../domain/enums/currency.enum';

export class CreateTransactionResponseDto {
  @ApiProperty({ example: '7bcfe595-752a-4ec5-9900-a1846625068f' })
  id!: string;

  @ApiProperty({ enum: Currency, example: Currency.USD })
  monedaOrigen!: Currency;

  @ApiProperty({ enum: Currency, example: Currency.PEN })
  monedaDestino!: Currency;

  @ApiProperty({ example: 100 })
  monto!: number;

  @ApiProperty({ example: 378 })
  montoCambiado!: number;

  @ApiProperty({ example: 3.78 })
  tipoCambio!: number;

  @ApiProperty({
    example: '2026-10-02T15:30:00.000Z',
    format: 'date-time',
  })
  fecha!: Date;
}

export function toCreateTransactionResponse(
  transaction: TransactionModel,
): CreateTransactionResponseDto {
  return {
    id: transaction.id,
    monedaOrigen: transaction.sourceCurrency,
    monedaDestino: transaction.targetCurrency,
    monto: transaction.sourceAmount,
    montoCambiado: transaction.targetAmount,
    tipoCambio: transaction.appliedRate,
    fecha: transaction.createdAt,
  };
}
