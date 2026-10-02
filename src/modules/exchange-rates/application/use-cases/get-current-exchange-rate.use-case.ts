import { AppLogger } from 'src/modules/shared/application/ports/app-logger';
import { ExchangeRateNotAvailableError } from '../errors/exchange-rate-not-available.error';
import {
  ExchangeRateModel,
  toExchangeRateModel,
} from '../models/exchange-rate.model';
import { ExchangeRateCache } from '../ports/exchange-rate-cache';
import { ExchangeRateRepository } from '../ports/exchange-rate.repository';

export class GetCurrentExchangeRateUseCase {
  constructor(
    private readonly repository: ExchangeRateRepository,
    private readonly cache: ExchangeRateCache,
    private readonly logger: AppLogger,
  ) { }

  async execute(): Promise<ExchangeRateModel> {
    const cachedRate = await this.cache.get();

    if (cachedRate) {
      this.logger.log('exchange_rate_retrieved_from_cache', {
        exchangeRateId: cachedRate.id,
        source: cachedRate.source,
        purchaseRate: cachedRate.purchaseRate,
        saleRate: cachedRate.saleRate,
      });
      return toExchangeRateModel(cachedRate);
    }

    const persistedRate = await this.repository.findLatest();

    if (!persistedRate) {
      this.logger.log('exchange_rate_not_available', {});
      throw new ExchangeRateNotAvailableError();
    }

    await this.cache.set(persistedRate);

    this.logger.log('exchange_rate_retrieved_from_repository', {
      exchangeRateId: persistedRate.id,
      source: persistedRate.source,
      purchaseRate: persistedRate.purchaseRate,
      saleRate: persistedRate.saleRate,
    });

    return toExchangeRateModel(persistedRate);
  }
}
