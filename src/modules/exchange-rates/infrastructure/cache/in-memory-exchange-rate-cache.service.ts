import { Injectable } from '@nestjs/common';
import { ExchangeRateCache } from '../../application/ports/exchange-rate-cache';
import { ExchangeRate } from '../../domain/entities/exchange-rate.entity';

@Injectable()
export class InMemoryExchangeRateCache implements ExchangeRateCache {
    private currentRate: ExchangeRate | null = null;

    async get(): Promise<ExchangeRate | null> {
        return this.currentRate;
    }

    async set(exchangeRate: ExchangeRate): Promise<void> {
        this.currentRate = exchangeRate;
    }

    async clear(): Promise<void> {
        this.currentRate = null;
    }
}