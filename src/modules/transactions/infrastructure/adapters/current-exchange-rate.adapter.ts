import { Injectable } from '@nestjs/common';
import { GetCurrentExchangeRateUseCase } from '../../../exchange-rates/application/use-cases/get-current-exchange-rate.use-case';
import {
    ExchangeRateReader,
    ExchangeRateReference,
} from '../../application/ports/exchange-rate.reader';

@Injectable()
export class CurrentExchangeRateAdapter
    implements ExchangeRateReader {
    constructor(
        private readonly getCurrentExchangeRate:
            GetCurrentExchangeRateUseCase,
    ) { }

    async getCurrent(): Promise<ExchangeRateReference> {
        const exchangeRate =
            await this.getCurrentExchangeRate.execute();

        return {
            purchaseRate: exchangeRate.purchaseRate,
            saleRate: exchangeRate.saleRate,
        };
    }
}