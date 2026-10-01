import { InvalidExchangeRateError } from '../errors/invalid-exchange-rate.error';

export interface ExchangeRateProperties {
  id: string;
  purchaseRate: number;
  saleRate: number;
  source: string;
  currency: string;
  rateDate: string;
  createdAt?: Date;
}

export interface ReconstituteExchangeRateProperties extends ExchangeRateProperties {
  createdAt: Date;
}

export class ExchangeRate {
  private constructor(
    private readonly exchangeRateId: string,
    private readonly exchangeRatePurchaseRate: number,
    private readonly exchangeRateSaleRate: number,
    private readonly exchangeRateSource: string,
    private readonly exchangeRateCurrency: string,
    private readonly exchangeRateRateDate: string,
    private readonly exchangeRateCreatedAt: Date,
  ) {}

  static create(properties: ExchangeRateProperties): ExchangeRate {
    return ExchangeRate.build({
      ...properties,
      createdAt: properties.createdAt ?? new Date(),
    });
  }

  static reconstitute(
    properties: ReconstituteExchangeRateProperties,
  ): ExchangeRate {
    return ExchangeRate.build(properties);
  }

  private static build(
    properties: ReconstituteExchangeRateProperties,
  ): ExchangeRate {
    if (
      !properties.id ||
      !Number.isFinite(properties.purchaseRate) ||
      properties.purchaseRate <= 0 ||
      !Number.isFinite(properties.saleRate) ||
      properties.saleRate <= 0
    ) {
      throw new InvalidExchangeRateError();
    }

    return new ExchangeRate(
      properties.id,
      properties.purchaseRate,
      properties.saleRate,
      properties.source,
      properties.currency,
      properties.rateDate,
      properties.createdAt,
    );
  }

  get id(): string {
    return this.exchangeRateId;
  }

  get purchaseRate(): number {
    return this.exchangeRatePurchaseRate;
  }

  get saleRate(): number {
    return this.exchangeRateSaleRate;
  }

  get source(): string {
    return this.exchangeRateSource;
  }

  get currency(): string {
    return this.exchangeRateCurrency;
  }

  get rateDate(): string {
    return this.exchangeRateRateDate;
  }

  get createdAt(): Date {
    return this.exchangeRateCreatedAt;
  }
}
