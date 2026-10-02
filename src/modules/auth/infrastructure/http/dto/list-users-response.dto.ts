import { ApiProperty } from '@nestjs/swagger';
import { UserSummary } from 'src/modules/auth/application/models/user-summary.model';

export class UserSummaryResponseDto {
  @ApiProperty({ example: '7bcfe595-752a-4ec5-9900-a1846625068f' })
  id!: string;

  @ApiProperty({ example: 'John Doe' })
  nombre!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;
}

export class ListUsersResponseDto {
  @ApiProperty({ type: [UserSummaryResponseDto] })
  usuarios!: UserSummaryResponseDto[];
}

export function toListUsersResponse(
  users: UserSummary[],
): ListUsersResponseDto {
  return {
    usuarios: users.map((user) => ({
      id: user.id,
      nombre: user.name,
      email: user.email,
    })),
  };
}
