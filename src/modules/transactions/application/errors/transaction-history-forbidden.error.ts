import { ApplicationError } from '../../../shared/application/errors/application.error';

export class TransactionHistoryForbiddenError
  extends ApplicationError
{
  constructor() {
    super(
      'TRANSACTION_HISTORY_FORBIDDEN',
      'Only administrators can request another user history',
      'forbidden',
    );
  }
}