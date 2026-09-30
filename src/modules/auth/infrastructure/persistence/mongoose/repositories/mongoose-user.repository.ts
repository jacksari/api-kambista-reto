import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserAlreadyExistsError } from '../../../../application/errors/user-already-exists.error';
import { UserRepository } from '../../../../application/ports/user.repository';
import { User } from '../../../../domain/entities/user.entity';
import { Email } from '../../../../domain/value-objects/email.value-object';
import { UserMapper, UserPersistenceData } from '../mappers/user.mapper';
import { UserDocument, UserPersistence } from '../schemas/user.schema';

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  );
}

@Injectable()
export class MongooseUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserPersistence.name)
    private readonly userModel: Model<UserDocument>,
  ) { }

  async findByEmail(email: Email): Promise<User | null> {
    const document = await this.userModel
      .findOne({ email: email.value })
      .lean<UserPersistenceData>()
      .exec();

    return document ? UserMapper.toDomain(document) : null;
  }

  async save(user: User): Promise<void> {
    try {
      await this.userModel.create(UserMapper.toPersistence(user));
    } catch (error: unknown) {
      if (isDuplicateKeyError(error)) {
        throw new UserAlreadyExistsError();
      }

      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    const document = await this.userModel
      .findById(id)
      .lean<UserPersistenceData>()
      .exec();

    return document ? UserMapper.toDomain(document) : null;
  }
}
