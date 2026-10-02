import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ListUsersUseCase } from '../../../application/use-cases/list-users.use-case';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import {
  ListUsersResponseDto,
  toListUsersResponse,
} from '../dto/list-users-response.dto';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly listUsers: ListUsersUseCase) {}

  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'List users available for administration' })
  @ApiOkResponse({
    description: 'Users retrieved successfully',
    type: ListUsersResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'The access token is missing, invalid, or expired',
  })
  @ApiForbiddenResponse({
    description: 'Only administrators can list users',
  })
  async findAll(): Promise<ListUsersResponseDto> {
    const users = await this.listUsers.execute();
    return toListUsersResponse(users);
  }
}
