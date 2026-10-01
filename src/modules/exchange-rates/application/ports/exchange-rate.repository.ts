import { ExchangeRate } from '../../domain/entities/exchange-rate.entity';

export interface ExchangeRateRepository {
  findLatest(): Promise<ExchangeRate | null>;
  save(exchangeRate: ExchangeRate): Promise<void>;
}
