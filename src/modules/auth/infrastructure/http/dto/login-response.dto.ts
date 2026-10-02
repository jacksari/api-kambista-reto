import { ApiProperty } from '@nestjs/swagger';
import { LoginUserModel } from 'src/modules/auth/application/models/login.model';
import { UserRole } from 'src/modules/auth/domain/enums/user-role.enum';

export class LoginResponseUserDto {
  @ApiProperty({ example: '7bcfe595-752a-4ec5-9900-a1846625068f' })
  id!: string;

  @ApiProperty({ example: 'John Doe' })
  nombre!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  rol!: UserRole;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT used to access protected endpoints',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string;

  @ApiProperty({ type: LoginResponseUserDto })
  usuario!: LoginResponseUserDto;
}

export function toLoginResponse(userLogin: LoginUserModel): LoginResponseDto {
  return {
    access_token: userLogin.accessToken,
    usuario: {
      id: userLogin.user.id,
      nombre: userLogin.user.name,
      email: userLogin.user.email,
      rol: userLogin.user.role,
    },
  };
}
