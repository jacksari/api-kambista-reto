import { IdGenerator } from '../../../shared/application/ports/id-generator';
import { Transaction } from '../../domain/entities/transaction.entity';
import { Currency } from '../../domain/enums/currency.enum';
import { CurrencyExchangeService } from '../../domain/services/currency-exchange.service';
import { Money } from '../../domain/value-objects/money.value-object';
import {
    TransactionModel,
    toTransactionModel,
} from '../models/transaction.model';
import { ExchangeRateReader } from '../ports/exchange-rate.reader';
import { TransactionRepository } from '../ports/transaction.repository';

export interface CreateTransactionCommand {
    userId: string;
    sourceCurrency: Currency;
    targetCurrency: Currency;
    amount: number;
}

export class CreateTransactionUseCase {
    constructor(
        private readonly repository: TransactionRepository,
        private readonly exchangeRateReader: ExchangeRateReader,
        private readonly idGenerator: IdGenerator,
        private readonly exchangeService: CurrencyExchangeService,
    ) { }

    async execute(
        command: CreateTransactionCommand,
    ): Promise<TransactionModel> {
        const currentRate =
            await this.exchangeRateReader.getCurrent();

        const source = Money.create(
            command.amount,
            command.sourceCurrency,
        );

        const conversion = this.exchangeService.calculate(
            source,
            command.targetCurrency,
            currentRate,
        );

        const transaction = Transaction.create({
            id: this.idGenerator.generate(),
            userId: command.userId,
            source,
            target: conversion.target,
            appliedRate: conversion.appliedRate,
        });

        await this.repository.save(transaction);

        return toTransactionModel(transaction);
    }
}