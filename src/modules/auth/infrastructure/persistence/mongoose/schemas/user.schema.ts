import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from 'src/modules/auth/domain/enums/user-role.enum';

export type UserDocument = HydratedDocument<UserPersistence>;


@Schema({
  collection: 'users',
  timestamps: true,
  versionKey: false,
})
export class UserPersistence {
  @Prop({ required: true, type: String })
  _id!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({
    index: true,
    lowercase: true,
    required: true,
    trim: true,
    unique: true,
  })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
    required: true,
  })
  role!: UserRole;

  @Prop({ required: true })
  createdAt!: Date;

  @Prop({ required: true })
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserPersistence);
