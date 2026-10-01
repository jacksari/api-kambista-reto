import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { IdGenerator } from '../../shared/application/ports/id-generator';
import { UuidGenerator } from '../../shared/infrastructure/identity/uuid-generator.service';
import { AccessTokenService } from '../application/ports/access-token.service';
import { PasswordHasher } from '../application/ports/password-hasher';
import { UserRepository } from '../application/ports/user.repository';
import { LoginUserUseCase } from '../application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { BcryptPasswordHasher } from './cryptography/bcrypt-password-hasher.service';
import { AUTH_TOKENS } from './dependency-injection/auth.tokens';
import { AuthController } from './http/controllers/auth.controller';
import { JwtAuthGuard } from './http/guards/jwt-auth.guard';
import { MongooseUserRepository } from './persistence/mongoose/repositories/mongoose-user.repository';
import {
  UserPersistence,
  UserSchema,
} from './persistence/mongoose/schemas/user.schema';
import { JwtAccessTokenService } from './tokens/jwt-access-token.service';
import { GetProfileUseCase } from '../application/use-cases/get-profile.use-case';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserPersistence.name, schema: UserSchema },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<number>('JWT_EXPIRES_IN_SECONDS'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    BcryptPasswordHasher,
    JwtAccessTokenService,
    JwtAuthGuard,
    MongooseUserRepository,
    UuidGenerator,
    {
      provide: AUTH_TOKENS.userRepository,
      useExisting: MongooseUserRepository,
    },
    {
      provide: AUTH_TOKENS.passwordHasher,
      useExisting: BcryptPasswordHasher,
    },
    {
      provide: AUTH_TOKENS.accessTokenService,
      useExisting: JwtAccessTokenService,
    },
    {
      provide: AUTH_TOKENS.idGenerator,
      useExisting: UuidGenerator,
    },
    {
      provide: RegisterUserUseCase,
      inject: [
        AUTH_TOKENS.userRepository,
        AUTH_TOKENS.passwordHasher,
        AUTH_TOKENS.idGenerator,
      ],
      useFactory: (
        userRepository: UserRepository,
        passwordHasher: PasswordHasher,
        idGenerator: IdGenerator,
      ) => new RegisterUserUseCase(userRepository, passwordHasher, idGenerator),
    },
    {
      provide: LoginUserUseCase,
      inject: [
        AUTH_TOKENS.userRepository,
        AUTH_TOKENS.passwordHasher,
        AUTH_TOKENS.accessTokenService,
      ],
      useFactory: (
        userRepository: UserRepository,
        passwordHasher: PasswordHasher,
        accessTokenService: AccessTokenService,
      ) =>
        new LoginUserUseCase(
          userRepository,
          passwordHasher,
          accessTokenService,
        ),
    },
    {
      provide: GetProfileUseCase,
      inject: [AUTH_TOKENS.userRepository],
      useFactory: (userRepository: UserRepository) =>
        new GetProfileUseCase(userRepository),
    },
  ],
  exports: [JwtAuthGuard, JwtAccessTokenService],
})
export class AuthModule { }
