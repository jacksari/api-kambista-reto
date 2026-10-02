import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetCurrentExchangeRateUseCase } from '../../../application/use-cases/get-current-exchange-rate.use-case';
import { JwtAuthGuard } from '../../../../auth/infrastructure/http/guards/jwt-auth.guard';
import {
  GetCurrentExchangeRateResponseDto,
  toGetCurrentExchangeRateResponse,
} from '../dto/get-current-exchange-rate-response.dto';

@ApiTags('Exchange rates')
@ApiBearerAuth('access-token')
@Controller('exchange-rates')
@UseGuards(JwtAuthGuard)
export class ExchangeRateController {
  constructor(
    private readonly getCurrentExchangeRate: GetCurrentExchangeRateUseCase,
  ) {}

  @Get('current')
  @ApiOperation({ summary: 'Get the current exchange rate' })
  @ApiOkResponse({
    description: 'Current exchange rate retrieved successfully',
    type: GetCurrentExchangeRateResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'The access token is missing, invalid, or expired',
  })
  @ApiServiceUnavailableResponse({
    description: 'No exchange rate is available',
  })
  async getCurrent(): Promise<GetCurrentExchangeRateResponseDto> {
    const exchangeRate = await this.getCurrentExchangeRate.execute();
    return toGetCurrentExchangeRateResponse(exchangeRate);
  }
}
