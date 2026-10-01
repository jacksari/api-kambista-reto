import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetCurrentExchangeRateUseCase } from '../../../application/use-cases/get-current-exchange-rate.use-case';
import { ExchangeRateModel } from '../../../application/models/exchange-rate.model';
import { JwtAuthGuard } from '../../../../auth/infrastructure/http/guards/jwt-auth.guard';

@Controller('exchange-rates')
@UseGuards(JwtAuthGuard)
export class ExchangeRateController {
  constructor(
    private readonly getCurrentExchangeRate: GetCurrentExchangeRateUseCase,
  ) {}

  @Get('current')
  getCurrent(): Promise<ExchangeRateModel> {
    return this.getCurrentExchangeRate.execute();
  }
}
