import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExchangeRateProviderUnavailableError } from '../../application/errors/exchange-rate-provider-unavailable.error';
import {
  ExchangeRateProvider,
  ExchangeRateQuote,
} from '../../application/ports/exchange-rate.provider';

const DEFAULT_SUNAT_URL = 'https://api.apis.net.pe/v1/tipo-cambio-sunat';
const REQUEST_TIMEOUT_MILLISECONDS = 10_000;

interface SunatExchangeRateResponse {
  compra: number;
  venta: number;
  origen: string;
  moneda: string;
  fecha: string;
}

function isSunatExchangeRateResponse(
  value: unknown,
): value is SunatExchangeRateResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return (
    'compra' in value &&
    typeof value.compra === 'number' &&
    Number.isFinite(value.compra) &&
    'venta' in value &&
    typeof value.venta === 'number' &&
    Number.isFinite(value.venta) &&
    'origen' in value &&
    typeof value.origen === 'string' &&
    'moneda' in value &&
    typeof value.moneda === 'string' &&
    'fecha' in value &&
    typeof value.fecha === 'string'
  );
}

@Injectable()
export class SunatExchangeRateProvider implements ExchangeRateProvider {
  constructor(private readonly config: ConfigService) {}

  async getCurrent(): Promise<ExchangeRateQuote> {
    const url = this.config.get<string>(
      'SUNAT_EXCHANGE_RATE_URL',
      DEFAULT_SUNAT_URL,
    );

    try {
      const response = await fetch(url, {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MILLISECONDS),
      });

      console.log('SunatExchangeRateProvider response:', response);
      console.log('SunatExchangeRateProvider response status:', response.status);
      console.log('SunatExchangeRateProvider response headers:', response.headers);

      if (!response.ok) {
        throw new ExchangeRateProviderUnavailableError();
      }

      const payload: unknown = await response.json();

      console.log('SunatExchangeRateProvider payload:', payload);

      if (!isSunatExchangeRateResponse(payload)) {
        throw new ExchangeRateProviderUnavailableError();
      }

      return {
        purchaseRate: payload.compra,
        saleRate: payload.venta,
        source: payload.origen,
        currency: payload.moneda,
        rateDate: payload.fecha,
      };
    } catch (error: unknown) {
      if (error instanceof ExchangeRateProviderUnavailableError) {
        throw error;
      }

      throw new ExchangeRateProviderUnavailableError();
    }
  }
}
