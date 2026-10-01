import { DomainError } from '../../../shared/domain/errors/domain.error';

export class SameCurrencyError extends DomainError {
    constructor() {
        super(
            'SAME_CURRENCY',
            'Source and target currencies cannot be the same',
        );
    }
}