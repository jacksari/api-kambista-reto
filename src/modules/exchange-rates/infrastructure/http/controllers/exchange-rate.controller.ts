import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetCurrentExchangeRateUseCase } from '../../../application/use-cases/get-current-exchange-rate.use-case';
import { JwtAuthGuard } from '../../../../auth/infrastructure/http/guards/jwt-auth.guard';
import { GetCurrentExchangeRateResponseDto, toGetCurrentExchangeRateResponse } from '../dto/get-current-exchange-rate-response.dto';

@Controller('exchange-rates')
@UseGuards(JwtAuthGuard)
export class ExchangeRateController {
  constructor(
    private readonly getCurrentExchangeRate: GetCurrentExchangeRateUseCase,
  ) { }

  @Get('current')
  async getCurrent(): Promise<GetCurrentExchangeRateResponseDto> {
    const exchangeRate = await this.getCurrentExchangeRate.execute();
    return toGetCurrentExchangeRateResponse(exchangeRate);
  }
}
