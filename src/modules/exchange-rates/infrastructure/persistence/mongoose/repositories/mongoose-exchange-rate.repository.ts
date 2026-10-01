import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExchangeRateRepository } from '../../../../application/ports/exchange-rate.repository';
import { ExchangeRate } from '../../../../domain/entities/exchange-rate.entity';
import {
  ExchangeRateMapper,
  ExchangeRatePersistenceData,
} from '../mappers/exchange-rate.mapper';
import {
  ExchangeRateDocument,
  ExchangeRatePersistence,
} from '../schemas/exchange-rate.schema';

@Injectable()
export class MongooseExchangeRateRepository implements ExchangeRateRepository {
  constructor(
    @InjectModel(ExchangeRatePersistence.name)
    private readonly exchangeRateModel: Model<ExchangeRateDocument>,
  ) {}

  async findLatest(): Promise<ExchangeRate | null> {
    const document = await this.exchangeRateModel
      .findOne()
      .sort({ createdAt: -1 })
      .lean<ExchangeRatePersistenceData>()
      .exec();

    return document ? ExchangeRateMapper.toDomain(document) : null;
  }

  async save(exchangeRate: ExchangeRate): Promise<void> {
    await this.exchangeRateModel.create(
      ExchangeRateMapper.toPersistence(exchangeRate),
    );
  }
}
