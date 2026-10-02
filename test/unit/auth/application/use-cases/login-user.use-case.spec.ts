import { InvalidCredentialsError } from '../../../../../src/modules/auth/application/errors/invalid-credentials.error';
import { LoginUserUseCase } from '../../../../../src/modules/auth/application/use-cases/login-user.use-case';
import { User } from '../../../../../src/modules/auth/domain/entities/user.entity';
import { Email } from '../../../../../src/modules/auth/domain/value-objects/email.value-object';
import {
  createAccessTokenServiceMock,
  createAppLoggerMock,
  createPasswordHasherMock,
  createUserRepositoryMock,
} from '../../mocks/auth-dependencies.mocks';

describe('LoginUserUseCase', () => {
  let userRepositoryMock: ReturnType<typeof createUserRepositoryMock>;
  let passwordHasherMock: ReturnType<typeof createPasswordHasherMock>;
  let accessTokenServiceMock: ReturnType<typeof createAccessTokenServiceMock>;
  let loggerMock: ReturnType<typeof createAppLoggerMock>;
  let useCase: LoginUserUseCase;

  beforeEach(() => {
    userRepositoryMock = createUserRepositoryMock();
    passwordHasherMock = createPasswordHasherMock();
    accessTokenServiceMock = createAccessTokenServiceMock();
    loggerMock = createAppLoggerMock();

    useCase = new LoginUserUseCase(
      userRepositoryMock.dependency,
      passwordHasherMock.dependency,
      accessTokenServiceMock.dependency,
      loggerMock.dependency,
    );
  });

  it('authenticates a user with valid credentials', async () => {
    const user = existingUser();
    userRepositoryMock.findByEmailMock.mockResolvedValue(user);
    passwordHasherMock.compareMock.mockResolvedValue(true);
    accessTokenServiceMock.issueMock.mockResolvedValue('access-token');

    const result = await useCase.execute({
      email: '  USER@EXAMPLE.COM ',
      password: 'StrongPassword123',
    });

    const searchedEmail = userRepositoryMock.findByEmailMock.mock.calls[0][0];

    expect(searchedEmail.value).toBe('user@example.com');
    expect(passwordHasherMock.compareMock).toHaveBeenCalledWith(
      'StrongPassword123',
      'stored-password-hash',
    );
    expect(accessTokenServiceMock.issueMock).toHaveBeenCalledWith(user);
    expect(loggerMock.logMock).toHaveBeenCalledWith('user_authenticated', {
      userId: 'user-id',
      role: 'user',
    });
    expect(result.accessToken).toBe('access-token');
    expect(result.user.id).toBe('user-id');
    expect(result.user.name).toBe('John Doe');
    expect(result.user.email).toBe('user@example.com');
    expect(result.user.role).toBe('user');
  });

  it('rejects an email that is not registered', async () => {
    userRepositoryMock.findByEmailMock.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: 'missing@example.com',
        password: 'OtherPassword',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);

    expect(passwordHasherMock.compareMock).not.toHaveBeenCalled();
    expect(accessTokenServiceMock.issueMock).not.toHaveBeenCalled();
    expect(loggerMock.logMock).not.toHaveBeenCalled();
  });

  it('rejects an incorrect password', async () => {
    const user = existingUser();
    userRepositoryMock.findByEmailMock.mockResolvedValue(user);
    passwordHasherMock.compareMock.mockResolvedValue(false);

    await expect(
      useCase.execute({
        email: 'user@example.com',
        password: 'OtherPassword',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);

    expect(passwordHasherMock.compareMock).toHaveBeenCalledWith(
      'OtherPassword',
      'stored-password-hash',
    );
    expect(accessTokenServiceMock.issueMock).not.toHaveBeenCalled();
    expect(loggerMock.logMock).not.toHaveBeenCalled();
  });
});

function existingUser(): User {
  return User.reconstitute({
    id: 'user-id',
    name: 'John Doe',
    email: Email.create('user@example.com'),
    passwordHash: 'stored-password-hash',
    createdAt: new Date('2026-10-02T12:00:00.000Z'),
  });
}
