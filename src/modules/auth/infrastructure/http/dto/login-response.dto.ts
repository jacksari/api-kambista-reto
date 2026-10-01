import { LoginUserModel } from "src/modules/auth/application/models/login.model";

export interface LoginResponseDto {
    access_token: string;
    usuario: {
        id: string;
        nombre: string;
        email: string;
        rol: string;
    }
}

export function toLoginResponse(
    userLogin: LoginUserModel,
): LoginResponseDto {
    return {
        access_token: userLogin.accessToken,
        usuario: {
            id: userLogin.user.id,
            nombre: userLogin.user.name,
            email: userLogin.user.email,
            rol: userLogin.user.role
        }
    };
}