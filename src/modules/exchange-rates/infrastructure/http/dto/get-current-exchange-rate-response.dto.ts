import { ApiProperty } from '@nestjs/swagger';
import { ExchangeRateModel } from 'src/modules/exchange-rates/application/models/exchange-rate.model';

export class GetCurrentExchangeRateResponseDto {
  @ApiProperty({ example: '7bcfe595-752a-4ec5-9900-a1846625068f' })
  id!: string;

  @ApiProperty({ example: 3.72 })
  tipoDeCambioCompra!: number;

  @ApiProperty({ example: 3.78 })
  tipoDeCambioVenta!: number;

  @ApiProperty({ example: 'SUNAT' })
  fuente!: string;

  @ApiProperty({ example: 'USD/PEN' })
  moneda!: string;

  @ApiProperty({ example: '2026-10-02', format: 'date' })
  fechaTipoDeCambio!: string;

  @ApiProperty({
    example: '2026-10-02T15:30:00.000Z',
    format: 'date-time',
  })
  fechaCreacion!: Date;
}

export function toGetCurrentExchangeRateResponse(
  exchangeRate: ExchangeRateModel,
): GetCurrentExchangeRateResponseDto {
  return {
    id: exchangeRate.id,
    tipoDeCambioCompra: exchangeRate.purchaseRate,
    tipoDeCambioVenta: exchangeRate.saleRate,
    fuente: exchangeRate.source,
    moneda: exchangeRate.currency,
    fechaTipoDeCambio: exchangeRate.rateDate,
    fechaCreacion: exchangeRate.createdAt,
  };
}
