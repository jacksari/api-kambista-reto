export const AUTH_TOKENS = {
  accessTokenService: Symbol('AccessTokenService'),
  idGenerator: Symbol('IdGenerator'),
  passwordHasher: Symbol('PasswordHasher'),
  userRepository: Symbol('UserRepository'),
} as const;
