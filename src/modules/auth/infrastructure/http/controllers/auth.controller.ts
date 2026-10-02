import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserUseCase } from '../../../application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../../../application/use-cases/register-user.use-case';
import { LoginRequestDto } from '../dto/login-request.dto';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { GetProfileUseCase } from 'src/modules/auth/application/use-cases/get-profile.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthenticatedUser } from '../../tokens/jwt-access-token.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { LoginResponseDto, toLoginResponse } from '../dto/login-response.dto';
import {
  ProfileResponseDto,
  toProfileResponse,
} from '../dto/profile-response.dto';
import {
  RegisterResponseDto,
  toRegisterResponse,
} from '../dto/register-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
    private readonly getProfile: GetProfileUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: RegisterResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'The request body is invalid',
  })
  @ApiConflictResponse({
    description: 'A user with the provided email already exists',
  })
  async register(
    @Body() request: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const result = await this.registerUser.execute(request);
    return toRegisterResponse(result);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiOkResponse({
    description: 'User authenticated successfully',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'The request body is invalid',
  })
  @ApiUnauthorizedResponse({
    description: 'Email or password is incorrect',
  })
  async login(@Body() request: LoginRequestDto): Promise<LoginResponseDto> {
    const userLogin = await this.loginUser.execute(request);
    return toLoginResponse(userLogin);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiOkResponse({
    description: 'Authenticated user profile',
    type: ProfileResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'The access token is missing, invalid, or expired',
  })
  @ApiNotFoundResponse({
    description: 'The authenticated user no longer exists',
  })
  async profile(
    @CurrentUser() authenticatedUser: AuthenticatedUser,
  ): Promise<ProfileResponseDto> {
    const profile = await this.getProfile.execute({
      userId: authenticatedUser.id,
    });
    return toProfileResponse(profile);
  }
}
