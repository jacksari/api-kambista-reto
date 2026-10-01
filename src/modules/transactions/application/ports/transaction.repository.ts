import { Transaction } from '../../domain/entities/transaction.entity';

export interface TransactionHistoryCriteria {
    userId: string;
    startDate: Date;
    endDate: Date;
    page: number;
    perPage: number;
}

export interface TransactionHistoryData {
    transactions: Transaction[];
    total: number;
}


export interface TransactionRepository {
    save(transaction: Transaction): Promise<void>;
    findHistory(
        criteria: TransactionHistoryCriteria,
    ): Promise<TransactionHistoryData>;
}