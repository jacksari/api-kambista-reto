import { TransactionModel } from "src/modules/transactions/application/models/transaction.model";

export interface CreateTransactionResponseDto {
    id: string;
    monedaOrigen: string;
    monedaDestino: string;
    monto: number;
    montoCambiado: number;
    tipoCambio: number;
    fecha: Date;
}

export function toCreateTransactionResponse(
    transaction: TransactionModel,
): CreateTransactionResponseDto {
    return {
        id: transaction.id,
        monedaOrigen: transaction.sourceCurrency,
        monedaDestino: transaction.targetCurrency,
        monto: transaction.sourceAmount,
        montoCambiado: transaction.targetAmount,
        tipoCambio: transaction.appliedRate,
        fecha: transaction.createdAt,
    };
}