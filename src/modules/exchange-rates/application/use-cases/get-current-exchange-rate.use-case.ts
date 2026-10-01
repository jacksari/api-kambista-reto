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
  ) { }

  async execute(): Promise<ExchangeRateModel> {
    const cachedRate = await this.cache.get();

    if (cachedRate) {
      return toExchangeRateModel(cachedRate);
    }

    const persistedRate = await this.repository.findLatest();

    if (!persistedRate) {
      throw new ExchangeRateNotAvailableError();
    }

    await this.cache.set(persistedRate);

    return toExchangeRateModel(persistedRate);
  }
}
