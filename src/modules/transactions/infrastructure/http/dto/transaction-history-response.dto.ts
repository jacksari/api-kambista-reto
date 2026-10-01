import { TransactionHistoryModel } from '../../../application/models/transaction-history.model';
import {
    CreateTransactionResponseDto,
    toCreateTransactionResponse,
} from './create-transaction-response.dto';

export interface TransactionHistoryResponseDto {
    data: CreateTransactionResponseDto[];
    pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
    };
}

export function toTransactionHistoryResponse(
    history: TransactionHistoryModel,
): TransactionHistoryResponseDto {
    return {
        data: history.data.map(toCreateTransactionResponse),
        pagination: history.pagination,
    };
}