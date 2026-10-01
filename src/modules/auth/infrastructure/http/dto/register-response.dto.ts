import { LoginUserModel } from "src/modules/auth/application/models/login.model";
import { RegisterUserModel } from "src/modules/auth/application/models/register.model";

export interface RegisterResponseDto {
    access_token: string;
    usuario: {
        id: string;
        nombre: string;
        email: string;
        rol: string;
    }
}

export function toRegisterResponse(
    userRegister: RegisterUserModel,
): RegisterResponseDto {
    return {
        access_token: userRegister.accessToken,
        usuario: {
            id: userRegister.user.id,
            nombre: userRegister.user.name,
            email: userRegister.user.email,
            rol: userRegister.user.role
        }
    };
}