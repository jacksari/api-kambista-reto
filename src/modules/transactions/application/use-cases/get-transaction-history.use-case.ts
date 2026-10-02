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

        const { authenticatedUserId, isAdmin, requestedUserId, startDate, endDate, page, perPage } = query;

        if (startDate > endDate) {
            throw new InvalidDateRangeError();
        }

        if (requestedUserId && !isAdmin) {
            throw new TransactionHistoryForbiddenError();
        }

        const targetUserId =
            requestedUserId ?? authenticatedUserId;

        const result = await this.repository.findHistory({
            userId: targetUserId,
            startDate: startDate,
            endDate: endDate,
            page: page,
            perPage: perPage,
        });

        return {
            data: result.transactions.map(toTransactionModel),
            pagination: {
                page: page,
                perPage: perPage,
                total: result.total,
                totalPages: Math.ceil(result.total / perPage),
            },
        };
    }
}