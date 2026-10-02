import { ApiProperty } from '@nestjs/swagger';
import { TransactionHistoryModel } from '../../../application/models/transaction-history.model';
import {
  CreateTransactionResponseDto,
  toCreateTransactionResponse,
} from './create-transaction-response.dto';

export class TransactionPaginationResponseDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  perPage!: number;

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 3 })
  totalPages!: number;
}

export class TransactionHistoryResponseDto {
  @ApiProperty({ type: [CreateTransactionResponseDto] })
  data!: CreateTransactionResponseDto[];

  @ApiProperty({ type: TransactionPaginationResponseDto })
  pagination!: TransactionPaginationResponseDto;
}

export function toTransactionHistoryResponse(
  history: TransactionHistoryModel,
): TransactionHistoryResponseDto {
  return {
    data: history.data.map(toCreateTransactionResponse),
    pagination: history.pagination,
  };
}
