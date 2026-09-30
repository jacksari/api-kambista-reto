import { ApplicationError } from '../../../shared/application/errors/application.error';

export class UserAlreadyExistsError extends ApplicationError {
  constructor() {
    super(
      'USER_ALREADY_EXISTS',
      'A user with this email already exists',
      'conflict',
    );
  }
}
