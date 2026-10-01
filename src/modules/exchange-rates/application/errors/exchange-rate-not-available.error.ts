import { ApplicationError } from '../../../shared/application/errors/application.error';

export class ExchangeRateNotAvailableError extends ApplicationError {
  constructor() {
    super(
      'EXCHANGE_RATE_NOT_AVAILABLE',
      'An exchange rate is not available',
      'unavailable',
    );
  }
}
