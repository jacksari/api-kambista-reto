import { Currency } from '../../domain/enums/currency.enum';
import { Transaction } from '../../domain/entities/transaction.entity';

export interface TransactionModel {
    id: string;
    userId: string;
    sourceCurrency: Currency;
    targetCurrency: Currency;
    sourceAmount: number;
    targetAmount: number;
    appliedRate: number;
    createdAt: Date;
}

export function toTransactionModel(
    transaction: Transaction,
): TransactionModel {
    return {
        id: transaction.id,
        userId: transaction.userId,
        sourceCurrency: transaction.source.currency,
        targetCurrency: transaction.target.currency,
        sourceAmount: transaction.source.amount,
        targetAmount: transaction.target.amount,
        appliedRate: transaction.appliedRate,
        createdAt: transaction.createdAt,
    };
}

