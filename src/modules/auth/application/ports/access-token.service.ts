import { User } from '../../domain/entities/user.entity';

export interface AccessTokenService {
  issue(user: User): Promise<string>;
}
