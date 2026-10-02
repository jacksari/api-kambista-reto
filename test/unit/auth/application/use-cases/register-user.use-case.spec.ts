import { UserAlreadyExistsError } from '../../../../../src/modules/auth/application/errors/user-already-exists.error';
import { RegisterUserUseCase } from '../../../../../src/modules/auth/application/use-cases/register-user.use-case';
import { User } from '../../../../../src/modules/auth/domain/entities/user.entity';
import { Email } from '../../../../../src/modules/auth/domain/value-objects/email.value-object';
import {
  createAccessTokenServiceMock,
  createAppLoggerMock,
  createIdGeneratorMock,
  createPasswordHasherMock,
  createUserRepositoryMock,
} from '../../mocks/auth-dependencies.mocks';

describe('RegisterUserUseCase', () => {
  let userRepositoryMock: ReturnType<typeof createUserRepositoryMock>;
  let passwordHasherMock: ReturnType<typeof createPasswordHasherMock>;
  let idGeneratorMock: ReturnType<typeof createIdGeneratorMock>;
  let accessTokenServiceMock: ReturnType<typeof createAccessTokenServiceMock>;
  let loggerMock: ReturnType<typeof createAppLoggerMock>;
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    userRepositoryMock = createUserRepositoryMock();
    passwordHasherMock = createPasswordHasherMock();
    idGeneratorMock = createIdGeneratorMock();
    accessTokenServiceMock = createAccessTokenServiceMock();
    loggerMock = createAppLoggerMock();

    useCase = new RegisterUserUseCase(
      userRepositoryMock.dependency,
      passwordHasherMock.dependency,
      idGeneratorMock.dependency,
      accessTokenServiceMock.dependency,
      loggerMock.dependency,
    );
  });

  it('registers a new user', async () => {
    userRepositoryMock.findByEmailMock.mockResolvedValue(null);
    passwordHasherMock.hashMock.mockResolvedValue('hashed-password');
    idGeneratorMock.generateMock.mockReturnValue('user-id');
    accessTokenServiceMock.issueMock.mockResolvedValue('access-token');

    const result = await useCase.execute({
      email: '  USER@EXAMPLE.COM ',
      nombre: '  John Doe  ',
      password: 'StrongPassword123',
    });

    const searchedEmail = userRepositoryMock.findByEmailMock.mock.calls[0][0];
    const savedUser = userRepositoryMock.saveMock.mock.calls[0][0];

    expect(searchedEmail.value).toBe('user@example.com');
    expect(passwordHasherMock.hashMock).toHaveBeenCalledWith(
      'StrongPassword123',
    );
    expect(savedUser.id).toBe('user-id');
    expect(savedUser.name).toBe('John Doe');
    expect(savedUser.email.value).toBe('user@example.com');
    expect(savedUser.passwordHash).toBe('hashed-password');
    expect(accessTokenServiceMock.issueMock).toHaveBeenCalledWith(savedUser);
    expect(loggerMock.logMock).toHaveBeenCalledWith('user_registered', {
      userId: 'user-id',
      role: 'user',
    });
    expect(result.accessToken).toBe('access-token');
    expect(result.user.id).toBe('user-id');
    expect(result.user.name).toBe('John Doe');
    expect(result.user.email).toBe('user@example.com');
    expect(result.user.role).toBe('user');
  });

  it('rejects an email that is already registered', async () => {
    userRepositoryMock.findByEmailMock.mockResolvedValue(existingUser());

    await expect(
      useCase.execute({
        email: 'user@example.com',
        nombre: 'John Doe',
        password: 'StrongPassword123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);

    expect(passwordHasherMock.hashMock).not.toHaveBeenCalled();
    expect(idGeneratorMock.generateMock).not.toHaveBeenCalled();
    expect(userRepositoryMock.saveMock).not.toHaveBeenCalled();
    expect(accessTokenServiceMock.issueMock).not.toHaveBeenCalled();
    expect(loggerMock.logMock).not.toHaveBeenCalled();
  });
});

function existingUser(): User {
  return User.reconstitute({
    id: 'existing-user-id',
    name: 'Existing User',
    email: Email.create('user@example.com'),
    passwordHash: 'existing-password-hash',
    createdAt: new Date('2026-10-02T12:00:00.000Z'),
  });
}
