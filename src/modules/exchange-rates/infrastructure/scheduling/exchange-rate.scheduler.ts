import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { RefreshExchangeRateUseCase } from '../../application/use-cases/refresh-exchange-rate.use-case';

const REFRESH_INTERVAL_MILLISECONDS = 30_000;

@Injectable()
export class ExchangeRateScheduler implements OnApplicationBootstrap {
  private readonly logger = new Logger(ExchangeRateScheduler.name);
  private isRefreshing = false;

  constructor(
    private readonly refreshExchangeRate: RefreshExchangeRateUseCase,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.refresh();
  }

  @Interval(REFRESH_INTERVAL_MILLISECONDS)
  async refresh(): Promise<void> {
    if (this.isRefreshing) {
      this.logger.warn(
        'Exchange rate refresh skipped because one is in progress',
      );
      return;
    }

    this.isRefreshing = true;

    try {
      const exchangeRate = await this.refreshExchangeRate.execute();
      this.logger.log(
        `Exchange rate refreshed: purchase=${exchangeRate.purchaseRate}, sale=${exchangeRate.saleRate}`,
      );
    } catch (error: unknown) {
      this.logger.error(
        'Could not refresh the exchange rate',
        error instanceof Error ? error.stack : undefined,
      );
    } finally {
      this.isRefreshing = false;
    }
  }
}
