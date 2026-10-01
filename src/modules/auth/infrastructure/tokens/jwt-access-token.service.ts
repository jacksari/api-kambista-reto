import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenService } from '../../application/ports/access-token.service';
import { User } from '../../domain/entities/user.entity';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtAccessTokenService implements AccessTokenService {
  constructor(private readonly jwtService: JwtService) { }

  issue(user: User): Promise<string> {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email.value,
      role: user.role,
    } satisfies AccessTokenPayload);
  }

  async verify(token: string): Promise<AuthenticatedUser> {
    const payload =
      await this.jwtService.verifyAsync<AccessTokenPayload>(token);

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
