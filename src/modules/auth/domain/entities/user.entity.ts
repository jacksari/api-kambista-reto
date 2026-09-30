import { UserRole } from '../enums/user-role.enum';
import { InvalidUserError } from '../errors/invalid-user.error';
import { Email } from '../value-objects/email.value-object';

export interface CreateUserProperties {
  id: string;
  name: string;
  email: Email;
  passwordHash: string;
  role?: UserRole;
  createdAt?: Date;
}

export interface ReconstituteUserProperties extends CreateUserProperties {
  createdAt: Date;
}

export class User {
  private constructor(
    private readonly userId: string,
    private readonly userName: string,
    private readonly userEmail: Email,
    private readonly userPasswordHash: string,
    private readonly userRole: UserRole,
    private readonly userCreatedAt: Date,
  ) { }

  static create(properties: CreateUserProperties): User {
    return User.build({
      ...properties,
      role: properties.role ?? UserRole.USER,
      createdAt: properties.createdAt ?? new Date(),
    });
  }

  static reconstitute(properties: ReconstituteUserProperties): User {
    return User.build(properties);
  }

  private static build(properties: ReconstituteUserProperties): User {
    if (!properties.id || !properties.passwordHash) {
      throw new InvalidUserError();
    }

    return new User(
      properties.id,
      properties.name,
      properties.email,
      properties.passwordHash,
      properties.role ?? UserRole.USER,
      properties.createdAt,
    );
  }

  get id(): string {
    return this.userId;
  }

  get name(): string {
    return this.userName;
  }

  get email(): Email {
    return this.userEmail;
  }

  get passwordHash(): string {
    return this.userPasswordHash;
  }

  get role(): UserRole {
    return this.userRole;
  }

  get createdAt(): Date {
    return this.userCreatedAt;
  }
}
