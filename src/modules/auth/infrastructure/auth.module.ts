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
import { MongooseUserSummaryReader } from './persistence/mongoose/readers/mongoose-user-summary.reader';
import { RolesGuard } from './http/guards/roles.guard';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
import { UserSummaryReader } from '../application/ports/user-summary.reader';
import { UsersController } from './http/controllers/users.controller';
import { AppLogger } from '../../shared/application/ports/app-logger';
import { NestAppLogger } from '../../shared/infrastructure/logging/nest-app-logger.service';

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
  controllers: [AuthController, UsersController],
  providers: [
    BcryptPasswordHasher,
    JwtAccessTokenService,
    JwtAuthGuard,
    RolesGuard,
    MongooseUserRepository,
    UuidGenerator,
    MongooseUserSummaryReader,
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
      provide: AUTH_TOKENS.userSummaryReader,
      useExisting: MongooseUserSummaryReader,
    },
    {
      provide: RegisterUserUseCase,
      inject: [
        AUTH_TOKENS.userRepository,
        AUTH_TOKENS.passwordHasher,
        AUTH_TOKENS.idGenerator,
        AUTH_TOKENS.accessTokenService,
        NestAppLogger,
      ],
      useFactory: (
        userRepository: UserRepository,
        passwordHasher: PasswordHasher,
        idGenerator: IdGenerator,
        accessTokenService: AccessTokenService,
        logger: AppLogger,
      ) =>
        new RegisterUserUseCase(
          userRepository,
          passwordHasher,
          idGenerator,
          accessTokenService,
          logger,
        ),
    },
    {
      provide: LoginUserUseCase,
      inject: [
        AUTH_TOKENS.userRepository,
        AUTH_TOKENS.passwordHasher,
        AUTH_TOKENS.accessTokenService,
        NestAppLogger,
      ],
      useFactory: (
        userRepository: UserRepository,
        passwordHasher: PasswordHasher,
        accessTokenService: AccessTokenService,
        logger: AppLogger,
      ) =>
        new LoginUserUseCase(
          userRepository,
          passwordHasher,
          accessTokenService,
          logger,
        ),
    },
    {
      provide: GetProfileUseCase,
      inject: [AUTH_TOKENS.userRepository],
      useFactory: (userRepository: UserRepository) =>
        new GetProfileUseCase(userRepository),
    },
    {
      provide: ListUsersUseCase,
      inject: [AUTH_TOKENS.userSummaryReader],
      useFactory: (userSummaryReader: UserSummaryReader) =>
        new ListUsersUseCase(userSummaryReader),
    },
  ],
  exports: [JwtAuthGuard, JwtAccessTokenService, RolesGuard],
})
export class AuthModule {}
