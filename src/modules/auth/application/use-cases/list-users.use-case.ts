import { UserSummary } from '../models/user-summary.model';
import { UserSummaryReader } from '../ports/user-summary.reader';

export class ListUsersUseCase {
    constructor(
        private readonly userSummaryReader: UserSummaryReader,
    ) { }

    execute(): Promise<UserSummary[]> {
        return this.userSummaryReader.findAll();
    }
}