import { AuthUser } from "src/modules/auth/application/models/auth-user.model";

export interface ProfileResponseDto {
    id: string;
    nombre: string;
    email: string;
    rol: string;
}

export function toProfileResponse(
    profile: AuthUser,
): ProfileResponseDto {
    return {
        id: profile.id,
        nombre: profile.name,
        email: profile.email,
        rol: profile.role
    };
}