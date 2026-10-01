import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExchangeRateDocument = HydratedDocument<ExchangeRatePersistence>;

@Schema({
  collection: 'exchange_rates',
  timestamps: true,
  versionKey: false,
})
export class ExchangeRatePersistence {
  @Prop({ required: true, type: String })
  _id!: string;

  @Prop({ min: 0, required: true, type: Number })
  purchaseRate!: number;

  @Prop({ min: 0, required: true, type: Number })
  saleRate!: number;

  @Prop({ required: true, trim: true, type: String })
  source!: string;

  @Prop({ required: true, trim: true, type: String })
  currency!: string;

  @Prop({ required: true, type: String })
  rateDate!: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const ExchangeRateSchema = SchemaFactory.createForClass(
  ExchangeRatePersistence,
);

ExchangeRateSchema.index({ createdAt: -1 });
