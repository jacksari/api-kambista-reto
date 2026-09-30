import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  LoginUserResult,
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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
    private readonly getProfile: GetProfileUseCase,
  ) { }

  @Post('register')
  register(@Body() request: RegisterRequestDto): Promise<AuthUser> {
    return this.registerUser.execute(request);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() request: LoginRequestDto): Promise<LoginUserResult> {
    return this.loginUser.execute(request);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(
    @CurrentUser() authenticatedUser: AuthenticatedUser,
  ): Promise<AuthUser> {
    return this.getProfile.execute({
      userId: authenticatedUser.id,
    });
  }
}
