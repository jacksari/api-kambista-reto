import { ApiProperty } from '@nestjs/swagger';
import { RegisterUserModel } from 'src/modules/auth/application/models/register.model';
import { LoginResponseUserDto } from './login-response.dto';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'JWT used to access protected endpoints',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string;

  @ApiProperty({ type: LoginResponseUserDto })
  usuario!: LoginResponseUserDto;
}

export function toRegisterResponse(
  userRegister: RegisterUserModel,
): RegisterResponseDto {
  return {
    access_token: userRegister.accessToken,
    usuario: {
      id: userRegister.user.id,
      nombre: userRegister.user.name,
      email: userRegister.user.email,
      rol: userRegister.user.role,
    },
  };
}
