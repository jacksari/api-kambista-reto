import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nombre!: string;

  @ApiProperty({
    description: 'Email used to authenticate the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Password between 8 and 72 characters',
    example: 'StrongPassword123',
    minLength: 8,
    maxLength: 72,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}
