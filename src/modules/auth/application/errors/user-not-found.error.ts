import { ApplicationError } from '../../../shared/application/errors/application.error';

export class UserNotFoundError extends ApplicationError {
    constructor() {
        super('USER_NOT_FOUND', 'User was not found', 'not-found');
    }
}