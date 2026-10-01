import { ApplicationError } from '../../../shared/application/errors/application.error';

export class ExchangeRateProviderUnavailableError extends ApplicationError {
  constructor() {
    super(
      'EXCHANGE_RATE_PROVIDER_UNAVAILABLE',
      'The exchange rate provider is unavailable',
      'unavailable',
    );
  }
}
