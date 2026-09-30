import { AuthUser, toAuthUser } from '../models/auth-user.model';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { UserRepository } from '../ports/user.repository';

export interface GetProfileQuery {
    userId: string;
}

export class GetProfileUseCase {
    constructor(private readonly userRepository: UserRepository) {
        console.log('GetProfileUseCase initialized with userRepository:', userRepository);
     }

    async execute(query: GetProfileQuery): Promise<AuthUser> {
        const user = await this.userRepository.findById(query.userId);

        if (!user) {
            throw new UserNotFoundError();
        }

        return toAuthUser(user);
    }
}