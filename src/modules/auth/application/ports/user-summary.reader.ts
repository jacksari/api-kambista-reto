import { UserSummary } from '../models/user-summary.model';

export interface UserSummaryReader {
    findAll(): Promise<UserSummary[]>;
}