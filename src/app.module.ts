import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { ExchangeRatesModule } from './modules/exchange-rates/exchange-rates.module';
import { validateEnvironment } from './modules/shared/infrastructure/config/environment.config';
import { DatabaseModule } from './modules/shared/infrastructure/database/database.module';
import { GlobalExceptionFilter } from './modules/shared/infrastructure/http/filters/global-exception.filter';
import { HttpLoggingMiddleware } from './modules/shared/infrastructure/http/middleware/http-logging.middleware';
import { LoggingModule } from './modules/shared/infrastructure/logging/logging.module';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
    DatabaseModule,
    LoggingModule,
    AuthModule,
    ExchangeRatesModule,
    TransactionsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggingMiddleware).forRoutes('{*splat}');
  }
}
