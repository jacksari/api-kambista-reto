import { AccessTokenService } from '../../../../src/modules/auth/application/ports/access-token.service';
import { PasswordHasher } from '../../../../src/modules/auth/application/ports/password-hasher';
import { UserRepository } from '../../../../src/modules/auth/application/ports/user.repository';
import { AppLogger } from '../../../../src/modules/shared/application/ports/app-logger';
import { IdGenerator } from '../../../../src/modules/shared/application/ports/id-generator';

export function createUserRepositoryMock() {
  const findByEmailMock: jest.MockedFunction<UserRepository['findByEmail']> =
    jest.fn();
  const findByIdMock: jest.MockedFunction<UserRepository['findById']> =
    jest.fn();
  const saveMock: jest.MockedFunction<UserRepository['save']> = jest.fn();

  const dependency: UserRepository = {
    findByEmail: findByEmailMock,
    findById: findByIdMock,
    save: saveMock,
  };

  return {
    dependency,
    findByEmailMock,
    findByIdMock,
    saveMock,
  };
}

export function createPasswordHasherMock() {
  const compareMock: jest.MockedFunction<PasswordHasher['compare']> = jest.fn();
  const hashMock: jest.MockedFunction<PasswordHasher['hash']> = jest.fn();

  const dependency: PasswordHasher = {
    compare: compareMock,
    hash: hashMock,
  };

  return {
    dependency,
    compareMock,
    hashMock,
  };
}

export function createIdGeneratorMock() {
  const generateMock: jest.MockedFunction<IdGenerator['generate']> = jest.fn();
  const dependency: IdGenerator = {
    generate: generateMock,
  };

  return {
    dependency,
    generateMock,
  };
}

export function createAccessTokenServiceMock() {
  const issueMock: jest.MockedFunction<AccessTokenService['issue']> = jest.fn();
  const dependency: AccessTokenService = {
    issue: issueMock,
  };

  return {
    dependency,
    issueMock,
  };
}

export function createAppLoggerMock() {
  const logMock: jest.MockedFunction<AppLogger['log']> = jest.fn();
  const dependency: AppLogger = {
    log: logMock,
  };

  return {
    dependency,
    logMock,
  };
}
