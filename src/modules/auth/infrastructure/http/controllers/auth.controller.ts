import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  LoginUserUseCase,
} from '../../../application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.use-case';
import { AuthUser } from '../../../application/models/auth-user.model';
import { LoginRequestDto } from '../dto/login-request.dto';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { GetProfileUseCase } from 'src/modules/auth/application/use-cases/get-profile.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthenticatedUser } from '../../tokens/jwt-access-token.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { LoginResponseDto, toLoginResponse } from '../dto/login-response.dto';
import { ProfileResponseDto, toProfileResponse } from '../dto/profile-response.dto';
import { RegisterUserModel } from 'src/modules/auth/application/models/register.model';
import { RegisterResponseDto, toRegisterResponse } from '../dto/register-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
    private readonly getProfile: GetProfileUseCase,
  ) { }

  @Post('register')
  async register(@Body() request: RegisterRequestDto): Promise<RegisterResponseDto> {
    const result = await this.registerUser.execute(request);
    return toRegisterResponse(result);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() request: LoginRequestDto): Promise<LoginResponseDto> {
    const userLogin = await this.loginUser.execute(request);
    return toLoginResponse(userLogin);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(
    @CurrentUser() authenticatedUser: AuthenticatedUser,
  ): Promise<ProfileResponseDto> {
    const profile = await this.getProfile.execute({
      userId: authenticatedUser.id,
    });
    return toProfileResponse(profile);
  }
}
