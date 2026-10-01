import { Email } from '../../domain/value-objects/email.value-object';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';
import { AuthUser, toAuthUser } from '../models/auth-user.model';
import { LoginUserModel } from '../models/login.model';
import { AccessTokenService } from '../ports/access-token.service';
import { PasswordHasher } from '../ports/password-hasher';
import { UserRepository } from '../ports/user.repository';

export interface LoginUserCommand {
  email: string;
  password: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly accessTokenService: AccessTokenService,
  ) { }

  async execute(command: LoginUserCommand): Promise<LoginUserModel> {
    const email = Email.create(command.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await this.passwordHasher.compare(
      command.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      accessToken: await this.accessTokenService.issue(user),
      user: toAuthUser(user),
    };
  }
}
