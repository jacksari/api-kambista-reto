import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterRequestDto {

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nombre!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}
