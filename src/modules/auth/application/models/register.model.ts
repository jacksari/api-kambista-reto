import { AuthUser } from "./auth-user.model";

export interface RegisterUserModel {
    accessToken: string;
    user: AuthUser;
}
