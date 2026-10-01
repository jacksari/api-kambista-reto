import { ApplicationError } from '../../../shared/application/errors/application.error';

export class InvalidDateRangeError extends ApplicationError {
    constructor() {
        super(
            'INVALID_DATE_RANGE',
            'Start date must be earlier than or equal to end date',
            'bad-request',
        );
    }
}