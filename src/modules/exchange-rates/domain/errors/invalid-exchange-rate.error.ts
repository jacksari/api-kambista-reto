import { DomainError } from '../../../shared/domain/errors/domain.error';

export class InvalidExchangeRateError extends DomainError {
  constructor() {
    super(
      'INVALID_EXCHANGE_RATE',
      'Purchase and sale rates must be greater than zero',
    );
  }
}
