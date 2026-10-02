import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { AuthenticatedUser } from '../../tokens/jwt-access-token.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles =
            this.reflector.getAllAndOverride<UserRole[]>(
                ROLES_KEY,
                [
                    context.getHandler(),
                    context.getClass(),
                ],
            );

        if (!requiredRoles?.length) {
            return true;
        }

        const request =
            context.switchToHttp().getRequest<AuthenticatedRequest>();

        if (
            !request.user ||
            !requiredRoles.includes(request.user.role as UserRole)
        ) {
            throw new ForbiddenException(
                'You do not have permission to perform this action',
            );
        }

        return true;
    }
}