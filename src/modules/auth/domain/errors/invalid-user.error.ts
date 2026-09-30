import { DomainError } from '../../../shared/domain/errors/domain.error';

export class InvalidUserError extends DomainError {
  constructor() {
    super('INVALID_USER', 'User data is invalid');
  }
}
