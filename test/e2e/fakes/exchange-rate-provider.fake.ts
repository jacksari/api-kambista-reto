import { ExchangeRateProvider } from '../../../src/modules/exchange-rates/application/ports/exchange-rate.provider';

export const fakeExchangeRateProvider: ExchangeRateProvider = {
  getCurrent: () =>
    Promise.resolve({
      purchaseRate: 3.7,
      saleRate: 3.8,
      source: 'E2E',
      currency: 'USD/PEN',
      rateDate: new Date().toISOString().slice(0, 10),
    }),
};
