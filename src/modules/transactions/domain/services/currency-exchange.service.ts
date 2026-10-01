import { Currency } from '../enums/currency.enum';
import { SameCurrencyError } from '../errors/same-currency.error';
import { Money } from '../value-objects/money.value-object';

export interface ExchangeRateValues {
    purchaseRate: number;
    saleRate: number;
}

export interface CurrencyConversionResult {
    target: Money;
    appliedRate: number;
}

export class CurrencyExchangeService {
    calculate(
        source: Money,
        targetCurrency: Currency,
        exchangeRate: ExchangeRateValues,
    ): CurrencyConversionResult {
        if (source.currency === targetCurrency) {
            throw new SameCurrencyError();
        }

        if (
            source.currency === Currency.USD &&
            targetCurrency === Currency.PEN
        ) {
            return {
                target: Money.create(
                    this.round(source.amount * exchangeRate.saleRate),
                    Currency.PEN,
                ),
                appliedRate: exchangeRate.saleRate,
            };
        }

        return {
            target: Money.create(
                this.round(source.amount / exchangeRate.purchaseRate),
                Currency.USD,
            ),
            appliedRate: exchangeRate.purchaseRate,
        };
    }

    private round(value: number): number {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }
}