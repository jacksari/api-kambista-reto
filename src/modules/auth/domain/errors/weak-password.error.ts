import { DomainError } from '../../../shared/domain/errors/domain.error';

export class WeakPasswordError extends DomainError {
  constructor() {
    super('WEAK_PASSWORD', 'Password must contain between 8 and 72 characters');
  }
}
