import { ExchangeRateModel } from "src/modules/exchange-rates/application/models/exchange-rate.model";

export interface GetCurrentExchangeRateResponseDto {
    id: string;
    tipoDeCambioCompra: number;
    tipoDeCambioVenta: number;
    fuente: string;
    moneda: string;
    fechaTipoDeCambio: string;
    fechaCreacion: Date;
}

export function toGetCurrentExchangeRateResponse(
    exchangeRate: ExchangeRateModel,
): GetCurrentExchangeRateResponseDto {
    return {
        id: exchangeRate.id,
        tipoDeCambioCompra: exchangeRate.purchaseRate,
        tipoDeCambioVenta: exchangeRate.saleRate,
        fuente: exchangeRate.source,
        moneda: exchangeRate.currency,
        fechaTipoDeCambio: exchangeRate.rateDate,
        fechaCreacion: exchangeRate.createdAt,
    };
}
// getCurrentExchangeRate