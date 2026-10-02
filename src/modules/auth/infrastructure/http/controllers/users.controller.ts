import {
    Controller,
    Get,
    UseGuards,
} from '@nestjs/common';
import { ListUsersUseCase } from '../../../application/use-cases/list-users.use-case';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ListUsersResponseDto, toListUsersResponse } from '../dto/list-users-response.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(
        private readonly listUsers: ListUsersUseCase,
    ) { }

    @Roles(UserRole.ADMIN)
    @Get()
    async findAll(): Promise<ListUsersResponseDto> {
        const users = await this.listUsers.execute();
        return toListUsersResponse(users);
    }
}