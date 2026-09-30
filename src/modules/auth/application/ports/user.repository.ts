import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.value-object';

export interface UserRepository {
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
}
