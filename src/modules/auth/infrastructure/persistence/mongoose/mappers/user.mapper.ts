import { UserRole } from 'src/modules/auth/domain/enums/user-role.enum';
import { User } from '../../../../domain/entities/user.entity';
import { Email } from '../../../../domain/value-objects/email.value-object';
import { UserPersistence } from '../schemas/user.schema';

export interface UserPersistenceData {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

export class UserMapper {
  static toDomain(document: UserPersistenceData): User {
    return User.reconstitute({
      id: document._id,
      name: document.name,
      email: Email.create(document.email),
      passwordHash: document.passwordHash,
      role: document.role,
      createdAt: document.createdAt,
    });
  }

  static toPersistence(user: User): UserPersistence {
    return {
      _id: user.id,
      name: user.name,
      email: user.email.value,
      passwordHash: user.passwordHash,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.createdAt,
    };
  }
}
