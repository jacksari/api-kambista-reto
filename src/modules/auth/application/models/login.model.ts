import { AuthUser } from "./auth-user.model";

export interface LoginUserModel {
    accessToken: string;
    user: AuthUser;
}