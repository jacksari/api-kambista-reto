import { InvalidDateRangeError } from '../errors/invalid-date-range.error';
import { TransactionHistoryForbiddenError } from '../errors/transaction-history-forbidden.error';
import { TransactionHistoryModel } from '../models/transaction-history.model';
import { toTransactionModel } from '../models/transaction.model';
import { TransactionRepository } from '../ports/transaction.repository';

export interface GetTransactionHistoryQuery {
    authenticatedUserId: string;
    isAdmin: boolean;
    requestedUserId?: string;
    startDate: Date;
    endDate: Date;
    page: number;
    perPage: number;
}

export class GetTransactionHistoryUseCase {
    constructor(
        private readonly repository: TransactionRepository,
    ) { }

    async execute(
        query: GetTransactionHistoryQuery,
    ): Promise<TransactionHistoryModel> {
        if (query.startDate > query.endDate) {
            throw new InvalidDateRangeError();
        }

        if (query.requestedUserId && !query.isAdmin) {
            throw new TransactionHistoryForbiddenError();
        }

        const targetUserId =
            query.requestedUserId ?? query.authenticatedUserId;

        const result = await this.repository.findHistory({
            userId: targetUserId,
            startDate: query.startDate,
            endDate: query.endDate,
            page: query.page,
            perPage: query.perPage,
        });

        return {
            data: result.transactions.map(toTransactionModel),
            pagination: {
                page: query.page,
                perPage: query.perPage,
                total: result.total,
                totalPages: Math.ceil(result.total / query.perPage),
            },
        };
    }
}