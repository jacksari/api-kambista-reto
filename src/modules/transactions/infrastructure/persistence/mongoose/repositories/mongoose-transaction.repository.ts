import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionHistoryCriteria, TransactionHistoryData, TransactionRepository } from '../../../../application/ports/transaction.repository';
import { Transaction } from '../../../../domain/entities/transaction.entity';
import { TransactionMapper, TransactionPersistenceData } from '../mappers/transaction.mapper';
import {
    TransactionDocument,
    TransactionPersistence,
} from '../schemas/transaction.schema';

@Injectable()
export class MongooseTransactionRepository
    implements TransactionRepository {
    constructor(
        @InjectModel(TransactionPersistence.name)
        private readonly transactionModel:
            Model<TransactionDocument>,
    ) { }

    async save(transaction: Transaction): Promise<void> {
        await this.transactionModel.create(
            TransactionMapper.toPersistence(transaction),
        );
    }

    async findHistory(
        criteria: TransactionHistoryCriteria,
    ): Promise<TransactionHistoryData> {
        const filter = {
            userId: criteria.userId,
            createdAt: {
                $gte: criteria.startDate,
                $lte: criteria.endDate,
            },
        };

        const skip = (criteria.page - 1) * criteria.perPage;

        const [documents, total] = await Promise.all([
            this.transactionModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(criteria.perPage)
                .lean<TransactionPersistenceData[]>()
                .exec(),

            this.transactionModel
                .countDocuments(filter)
                .exec(),
        ]);

        return {
            transactions: documents.map(
                TransactionMapper.toDomain,
            ),
            total,
        };
    }
}