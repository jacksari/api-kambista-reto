import { ApiProperty } from '@nestjs/swagger';
import { AuthUser } from 'src/modules/auth/application/models/auth-user.model';
import { UserRole } from 'src/modules/auth/domain/enums/user-role.enum';

export class ProfileResponseDto {
  @ApiProperty({ example: '7bcfe595-752a-4ec5-9900-a1846625068f' })
  id!: string;

  @ApiProperty({ example: 'John Doe' })
  nombre!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  rol!: UserRole;
}

export function toProfileResponse(profile: AuthUser): ProfileResponseDto {
  return {
    id: profile.id,
    nombre: profile.name,
    email: profile.email,
    rol: profile.role,
  };
}
