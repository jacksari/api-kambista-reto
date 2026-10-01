export interface ExchangeRateReference {
    purchaseRate: number;
    saleRate: number;
}

export interface ExchangeRateReader {
    getCurrent(): Promise<ExchangeRateReference>;
}