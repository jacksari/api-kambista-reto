
import { DomainError } from '../../../shared/domain/errors/domain.error';

export class InvalidAmountError extends DomainError {
    constructor() {
        super(
            'INVALID_AMOUNT',
            'Amount must be greater than zero',
        );
    }
}