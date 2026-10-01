import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.value-object';
import { Password } from '../../domain/value-objects/password.value-object';
import { IdGenerator } from '../../../shared/application/ports/id-generator';
import { UserAlreadyExistsError } from '../errors/user-already-exists.error';
import { AuthUser, toAuthUser } from '../models/auth-user.model';
import { PasswordHasher } from '../ports/password-hasher';
import { UserRepository } from '../ports/user.repository';
import { RegisterUserModel } from '../models/register.model';
import { AccessTokenService } from '../ports/access-token.service';

export interface RegisterUserCommand {
  email: string;
  nombre: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly idGenerator: IdGenerator,
    private readonly accessTokenService: AccessTokenService,
  ) { }

  async execute(command: RegisterUserCommand): Promise<RegisterUserModel> {
    const email = Email.create(command.email);
    const name = command.nombre.trim();
    const password = Password.create(command.password);
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await this.passwordHasher.hash(password.value);
    const user = User.create({
      id: this.idGenerator.generate(),
      email,
      passwordHash,
      name,
    });

    await this.userRepository.save(user);

    return {
      accessToken: await this.accessTokenService.issue(user),
      user: toAuthUser(user),
    };
  }
}
