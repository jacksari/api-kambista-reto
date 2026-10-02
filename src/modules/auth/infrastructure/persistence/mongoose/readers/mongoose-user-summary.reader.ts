import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSummary } from '../../../../application/models/user-summary.model';
import { UserSummaryReader } from '../../../../application/ports/user-summary.reader';
import {
    UserDocument,
    UserPersistence,
} from '../schemas/user.schema';

interface UserSummaryDocument {
    _id: string;
    name: string;
    email: string;
}

@Injectable()
export class MongooseUserSummaryReader
    implements UserSummaryReader {
    constructor(
        @InjectModel(UserPersistence.name)
        private readonly userModel: Model<UserDocument>,
    ) { }

    async findAll(): Promise<UserSummary[]> {
        const users = await this.userModel
            .find()
            .select({
                _id: 1,
                name: 1,
                email: 1,
            })
            .sort({
                name: 1,
            })
            .lean<UserSummaryDocument[]>()
            .exec();

        return users.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
        }));
    }
}