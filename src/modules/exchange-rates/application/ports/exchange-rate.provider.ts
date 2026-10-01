export interface ExchangeRateQuote {
  purchaseRate: number;
  saleRate: number;
  source: string;
  currency: string;
  rateDate: string;
}

export interface ExchangeRateProvider {
  getCurrent(): Promise<ExchangeRateQuote>;
}
