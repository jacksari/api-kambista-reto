import { ExchangeRate } from '../../../../domain/entities/exchange-rate.entity';
import { ExchangeRatePersistence } from '../schemas/exchange-rate.schema';

export interface ExchangeRatePersistenceData {
  _id: string;
  purchaseRate: number;
  saleRate: number;
  source: string;
  currency: string;
  rateDate: string;
  createdAt: Date;
}

export class ExchangeRateMapper {
  static toDomain(document: ExchangeRatePersistenceData): ExchangeRate {
    return ExchangeRate.reconstitute({
      id: document._id,
      purchaseRate: document.purchaseRate,
      saleRate: document.saleRate,
      source: document.source,
      currency: document.currency,
      rateDate: document.rateDate,
      createdAt: document.createdAt,
    });
  }

  static toPersistence(exchangeRate: ExchangeRate): ExchangeRatePersistence {
    return {
      _id: exchangeRate.id,
      purchaseRate: exchangeRate.purchaseRate,
      saleRate: exchangeRate.saleRate,
      source: exchangeRate.source,
      currency: exchangeRate.currency,
      rateDate: exchangeRate.rateDate,
      createdAt: exchangeRate.createdAt,
      updatedAt: exchangeRate.createdAt,
    };
  }
}
