import { ExchangeRate } from '../../domain/entities/exchange-rate.entity';

export interface ExchangeRateModel {
  id: string;
  purchaseRate: number;
  saleRate: number;
  source: string;
  currency: string;
  rateDate: string;
  createdAt: Date;
}

export function toExchangeRateModel(
  exchangeRate: ExchangeRate,
): ExchangeRateModel {
  return {
    id: exchangeRate.id,
    purchaseRate: exchangeRate.purchaseRate,
    saleRate: exchangeRate.saleRate,
    source: exchangeRate.source,
    currency: exchangeRate.currency,
    rateDate: exchangeRate.rateDate,
    createdAt: exchangeRate.createdAt,
  };
}
