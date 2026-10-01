import { Currency } from '../enums/currency.enum';
import { InvalidAmountError } from '../errors/invalid-amount.error';

export class Money {
    private constructor(
        public readonly amount: number,
        public readonly currency: Currency,
    ) { }

    static create(amount: number, currency: Currency): Money {
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new InvalidAmountError();
        }

        return new Money(amount, currency);
    }
}