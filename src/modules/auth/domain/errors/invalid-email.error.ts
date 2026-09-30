import { DomainError } from '../../../shared/domain/errors/domain.error';

export class InvalidEmailError extends DomainError {
  constructor() {
    super('INVALID_EMAIL', 'Email address is invalid');
  }
}
