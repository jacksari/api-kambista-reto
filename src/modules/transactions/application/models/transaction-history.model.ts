import { TransactionModel } from './transaction.model';

export interface TransactionHistoryModel {
    data: TransactionModel[];
    pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
    };
}