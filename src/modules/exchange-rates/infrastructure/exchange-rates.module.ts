import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { IdGenerator } from '../../shared/application/ports/id-generator';
import { UuidGenerator } from '../../shared/infrastructure/identity/uuid-generator.service';
import { AuthModule } from '../../auth/auth.module';
import { ExchangeRateProvider } from '../application/ports/exchange-rate.provider';
import { ExchangeRateRepository } from '../application/ports/exchange-rate.repository';
import { GetCurrentExchangeRateUseCase } from '../application/use-cases/get-current-exchange-rate.use-case';
import { RefreshExchangeRateUseCase } from '../application/use-cases/refresh-exchange-rate.use-case';
import { EXCHANGE_RATE_TOKENS } from './dependency-injection/exchange-rate.tokens';
import { ExchangeRateController } from './http/controllers/exchange-rate.controller';
import { MongooseExchangeRateRepository } from './persistence/mongoose/repositories/mongoose-exchange-rate.repository';
import {
  ExchangeRatePersistence,
  ExchangeRateSchema,
} from './persistence/mongoose/schemas/exchange-rate.schema';
import { SunatExchangeRateProvider } from './providers/sunat-exchange-rate.provider';
import { ExchangeRateScheduler } from './scheduling/exchange-rate.scheduler';
import { InMemoryExchangeRateCache } from './cache/in-memory-exchange-rate-cache.service';
import { ExchangeRateCache } from '../application/ports/exchange-rate-cache';

@Module({
  imports: [
    AuthModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: ExchangeRatePersistence.name,
        schema: ExchangeRateSchema,
      },
    ]),
  ],
  controllers: [ExchangeRateController],
  providers: [
    ExchangeRateScheduler,
    MongooseExchangeRateRepository,
    SunatExchangeRateProvider,
    UuidGenerator,
    InMemoryExchangeRateCache,
    {
      provide: EXCHANGE_RATE_TOKENS.repository,
      useExisting: MongooseExchangeRateRepository,
    },
    {
      provide: EXCHANGE_RATE_TOKENS.provider,
      useExisting: SunatExchangeRateProvider,
    },
    {
      provide: EXCHANGE_RATE_TOKENS.idGenerator,
      useExisting: UuidGenerator,
    },
    {
      provide: EXCHANGE_RATE_TOKENS.cache,
      useExisting: InMemoryExchangeRateCache,
    },
    {
      provide: RefreshExchangeRateUseCase,
      inject: [
        EXCHANGE_RATE_TOKENS.provider,
        EXCHANGE_RATE_TOKENS.repository,
        EXCHANGE_RATE_TOKENS.idGenerator,
        EXCHANGE_RATE_TOKENS.cache,
      ],
      useFactory: (
        provider: ExchangeRateProvider,
        repository: ExchangeRateRepository,
        idGenerator: IdGenerator,
        cache: ExchangeRateCache,
      ) => new RefreshExchangeRateUseCase(provider, repository, idGenerator, cache),
    },
    {
      provide: GetCurrentExchangeRateUseCase,
      inject: [EXCHANGE_RATE_TOKENS.repository, EXCHANGE_RATE_TOKENS.cache],
      useFactory: (repository: ExchangeRateRepository, cache: ExchangeRateCache) =>
        new GetCurrentExchangeRateUseCase(repository, cache),
    },
  ],
  exports: [GetCurrentExchangeRateUseCase],
})
export class ExchangeRatesModule { }
