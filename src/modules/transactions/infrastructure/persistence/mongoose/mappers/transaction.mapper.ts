import { Transaction } from '../../../../domain/entities/transaction.entity';
import { Currency } from '../../../../domain/enums/currency.enum';
import { Money } from '../../../../domain/value-objects/money.value-object';
import { TransactionPersistence } from '../schemas/transaction.schema';

export interface TransactionPersistenceData {
    _id: string;
    userId: string;
    sourceCurrency: Currency;
    targetCurrency: Currency;
    sourceAmount: number;
    targetAmount: number;
    appliedRate: number;
    createdAt: Date;
}

export class TransactionMapper {
    static toDomain(
        document: TransactionPersistenceData,
    ): Transaction {
        return Transaction.reconstitute({
            id: document._id,
            userId: document.userId,
            source: Money.create(
                document.sourceAmount,
                document.sourceCurrency,
            ),
            target: Money.create(
                document.targetAmount,
                document.targetCurrency,
            ),
            appliedRate: document.appliedRate,
            createdAt: document.createdAt,
        });
    }

    static toPersistence(
        transaction: Transaction,
    ): TransactionPersistence {
        return {
            _id: transaction.id,
            userId: transaction.userId,
            sourceCurrency: transaction.source.currency,
            targetCurrency: transaction.target.currency,
            sourceAmount: transaction.source.amount,
            targetAmount: transaction.target.amount,
            appliedRate: transaction.appliedRate,
            createdAt: transaction.createdAt,
        };
    }
}