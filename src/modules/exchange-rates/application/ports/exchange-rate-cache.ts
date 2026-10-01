import { ExchangeRate } from '../../domain/entities/exchange-rate.entity';

export interface ExchangeRateCache {
    get(): Promise<ExchangeRate | null>;
    set(exchangeRate: ExchangeRate): Promise<void>;
    clear(): Promise<void>;
}