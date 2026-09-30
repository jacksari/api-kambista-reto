import { ApplicationError } from '../../../shared/application/errors/application.error';

export class InvalidCredentialsError extends ApplicationError {
  constructor() {
    super(
      'INVALID_CREDENTIALS',
      'Email or password is incorrect',
      'unauthorized',
    );
  }
}
