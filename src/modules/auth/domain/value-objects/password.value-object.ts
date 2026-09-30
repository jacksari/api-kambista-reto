import { WeakPasswordError } from '../errors/weak-password.error';

const MINIMUM_PASSWORD_LENGTH = 8;
const MAXIMUM_PASSWORD_LENGTH = 72;

export class Password {
  private constructor(public readonly value: string) {}

  static create(value: string): Password {
    if (
      value.length < MINIMUM_PASSWORD_LENGTH ||
      value.length > MAXIMUM_PASSWORD_LENGTH
    ) {
      throw new WeakPasswordError();
    }

    return new Password(value);
  }
}
