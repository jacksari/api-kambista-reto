import { Money } from '../value-objects/money.value-object';

export interface TransactionProperties {
    id: string;
    userId: string;
    source: Money;
    target: Money;
    appliedRate: number;
    createdAt?: Date;
}

export interface ReconstituteTransactionProperties
    extends TransactionProperties {
    createdAt: Date;
}

export class Transaction {
    private constructor(
        private readonly transactionId: string,
        private readonly transactionUserId: string,
        private readonly transactionSource: Money,
        private readonly transactionTarget: Money,
        private readonly transactionAppliedRate: number,
        private readonly transactionCreatedAt: Date,
    ) { }

    static create(properties: TransactionProperties): Transaction {
        return Transaction.build({
            ...properties,
            createdAt: properties.createdAt ?? new Date(),
        });
    }

    static reconstitute(
        properties: ReconstituteTransactionProperties,
    ): Transaction {
        return Transaction.build(properties);
    }

    private static build(
        properties: ReconstituteTransactionProperties,
    ): Transaction {
        return new Transaction(
            properties.id,
            properties.userId,
            properties.source,
            properties.target,
            properties.appliedRate,
            properties.createdAt,
        );
    }

    get id(): string {
        return this.transactionId;
    }

    get userId(): string {
        return this.transactionUserId;
    }

    get source(): Money {
        return this.transactionSource;
    }

    get target(): Money {
        return this.transactionTarget;
    }

    get appliedRate(): number {
        return this.transactionAppliedRate;
    }

    get createdAt(): Date {
        return this.transactionCreatedAt;
    }
}