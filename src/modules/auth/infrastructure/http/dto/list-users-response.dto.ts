import { UserSummary } from "src/modules/auth/application/models/user-summary.model";

export interface ListUsersResponseDto {
    usuarios: {
        id: string;
        nombre: string;
        email: string;
    }[];
}

export function toListUsersResponse(
    users: UserSummary[]
): ListUsersResponseDto {
    return {
        usuarios: users.map((user) => ({
            id: user.id,
            nombre: user.name,
            email: user.email
        }))
    };
}