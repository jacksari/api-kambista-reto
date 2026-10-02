import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../../auth/auth.module';
import { UuidGenerator } from '../../shared/infrastructure/identity/uuid-generator.service';
import {
  TransactionPersistence,
  TransactionSchema,
} from './persistence/mongoose/schemas/transaction.schema';
import { ExchangeRatesModule } from 'src/modules/exchange-rates/infrastructure/exchange-rates.module';
import { CurrentExchangeRateAdapter } from './adapters/current-exchange-rate.adapter';
import { MongooseTransactionRepository } from './persistence/mongoose/repositories/mongoose-transaction.repository';
import { TRANSACTION_TOKENS } from './dependency-injection/transactions.tokens';
import { CurrencyExchangeService } from '../domain/services/currency-exchange.service';
import { CreateTransactionUseCase } from '../application/use-cases/create-transaction.use-case';
import { TransactionRepository } from '../application/ports/transaction.repository';
import { ExchangeRateReader } from '../application/ports/exchange-rate.reader';
import { IdGenerator } from 'src/modules/shared/application/ports/id-generator';
import { TransactionController } from './http/controllers/transaction.controller';
import { GetTransactionHistoryUseCase } from '../application/use-cases/get-transaction-history.use-case';
import { AppLogger } from '../../shared/application/ports/app-logger';
import { NestAppLogger } from '../../shared/infrastructure/logging/nest-app-logger.service';

@Module({
  imports: [
    AuthModule,
    ExchangeRatesModule,
    MongooseModule.forFeature([
      {
        name: TransactionPersistence.name,
        schema: TransactionSchema,
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    CurrentExchangeRateAdapter,
    MongooseTransactionRepository,
    UuidGenerator,
    {
      provide: TRANSACTION_TOKENS.repository,
      useExisting: MongooseTransactionRepository,
    },
    {
      provide: TRANSACTION_TOKENS.exchangeRateReader,
      useExisting: CurrentExchangeRateAdapter,
    },
    {
      provide: TRANSACTION_TOKENS.idGenerator,
      useExisting: UuidGenerator,
    },
    {
      provide: CurrencyExchangeService,
      useFactory: () => new CurrencyExchangeService(),
    },
    {
      provide: CreateTransactionUseCase,
      inject: [
        TRANSACTION_TOKENS.repository,
        TRANSACTION_TOKENS.exchangeRateReader,
        TRANSACTION_TOKENS.idGenerator,
        CurrencyExchangeService,
        NestAppLogger,
      ],
      useFactory: (
        repository: TransactionRepository,
        exchangeRateReader: ExchangeRateReader,
        idGenerator: IdGenerator,
        exchangeService: CurrencyExchangeService,
        logger: AppLogger,
      ) =>
        new CreateTransactionUseCase(
          repository,
          exchangeRateReader,
          idGenerator,
          exchangeService,
          logger,
        ),
    },
    {
      provide: GetTransactionHistoryUseCase,
      inject: [TRANSACTION_TOKENS.repository],
      useFactory: (repository: TransactionRepository) =>
        new GetTransactionHistoryUseCase(repository),
    },
  ],
  exports: [],
})
export class TransactionsModule {}
