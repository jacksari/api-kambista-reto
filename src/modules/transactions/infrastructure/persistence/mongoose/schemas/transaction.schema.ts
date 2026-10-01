import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Currency } from '../../../../domain/enums/currency.enum';

export type TransactionDocument =
    HydratedDocument<TransactionPersistence>;

@Schema({
    collection: 'transactions',
    timestamps: {
        createdAt: true,
        updatedAt: false,
    },
    versionKey: false,
})
export class TransactionPersistence {
    @Prop({ required: true, type: String })
    _id!: string;

    @Prop({ index: true, required: true, type: String })
    userId!: string;

    @Prop({
        enum: Object.values(Currency),
        required: true,
        type: String,
    })
    sourceCurrency!: Currency;

    @Prop({
        enum: Object.values(Currency),
        required: true,
        type: String,
    })
    targetCurrency!: Currency;

    @Prop({ min: 0, required: true, type: Number })
    sourceAmount!: number;

    @Prop({ min: 0, required: true, type: Number })
    targetAmount!: number;

    @Prop({ min: 0, required: true, type: Number })
    appliedRate!: number;

    createdAt!: Date;
}

export const TransactionSchema =
    SchemaFactory.createForClass(TransactionPersistence);

TransactionSchema.index({
    userId: 1,
    createdAt: -1,
});