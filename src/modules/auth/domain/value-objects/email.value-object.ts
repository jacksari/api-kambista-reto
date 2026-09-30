import { InvalidEmailError } from '../errors/invalid-email.error';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private constructor(public readonly value: string) {}

  static create(value: string): Email {
    const normalizedEmail = value.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      throw new InvalidEmailError();
    }

    return new Email(normalizedEmail);
  }
}
