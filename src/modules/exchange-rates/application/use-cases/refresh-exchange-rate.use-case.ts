import { IdGenerator } from '../../../shared/application/ports/id-generator';
import { AppLogger } from '../../../shared/application/ports/app-logger';
import { ExchangeRate } from '../../domain/entities/exchange-rate.entity';
import {
  ExchangeRateModel,
  toExchangeRateModel,
} from '../models/exchange-rate.model';
import { ExchangeRateCache } from '../ports/exchange-rate-cache';
import { ExchangeRateProvider } from '../ports/exchange-rate.provider';
import { ExchangeRateRepository } from '../ports/exchange-rate.repository';

export class RefreshExchangeRateUseCase {
  constructor(
    private readonly provider: ExchangeRateProvider,
    private readonly repository: ExchangeRateRepository,
    private readonly idGenerator: IdGenerator,
    private readonly cache: ExchangeRateCache,
    private readonly logger: AppLogger,
  ) {}

  async execute(): Promise<ExchangeRateModel> {
    const quote = await this.provider.getCurrent();
    const exchangeRate = ExchangeRate.create({
      id: this.idGenerator.generate(),
      purchaseRate: quote.purchaseRate,
      saleRate: quote.saleRate,
      source: quote.source,
      currency: quote.currency,
      rateDate: quote.rateDate,
    });

    await this.repository.save(exchangeRate);
    await this.cache.set(exchangeRate);

    this.logger.log('exchange_rate_refreshed', {
      exchangeRateId: exchangeRate.id,
      source: exchangeRate.source,
      purchaseRate: exchangeRate.purchaseRate,
      saleRate: exchangeRate.saleRate,
    });

    return toExchangeRateModel(exchangeRate);
  }
}
