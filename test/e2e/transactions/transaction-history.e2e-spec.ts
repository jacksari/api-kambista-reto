import { Server } from 'node:http';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  createE2eTestApplication,
  E2eTestApplication,
} from '../support/e2e-test-application';
import { registerAndLogin } from '../support/register-and-login';

interface TransactionResponseBody {
  id: string;
}

interface TransactionHistoryResponseBody {
  data: TransactionResponseBody[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

describe('Transaction history (e2e)', () => {
  let testApplication: E2eTestApplication;
  let app: INestApplication<Server>;

  beforeAll(async () => {
    testApplication = await createE2eTestApplication();
    app = testApplication.app;
  });

  afterAll(async () => {
    await testApplication.close();
  });

  it('returns the authenticated user transaction history', async () => {
    const token = await registerAndLogin(app, 'transaction-history');
    const transactionResponse = await request(app.getHttpServer())
      .post('/v1/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        monedaOrigen: 'USD',
        monedaDestino: 'PEN',
        monto: 100,
      })
      .expect(201);
    const transaction = asTransactionResponse(
      transactionResponse.body as unknown,
    );

    const startDate = new Date(Date.now() - 60_000).toISOString();
    const endDate = new Date(Date.now() + 60_000).toISOString();
    const historyResponse = await request(app.getHttpServer())
      .get('/v1/transactions/history')
      .set('Authorization', `Bearer ${token}`)
      .query({
        startDate,
        endDate,
        page: 1,
        perPage: 20,
      })
      .expect(200);
    const history = asTransactionHistoryResponse(
      historyResponse.body as unknown,
    );

    expect(history.data).toContainEqual(
      expect.objectContaining({
        id: transaction.id,
      }),
    );
    expect(history.pagination).toEqual({
      page: 1,
      perPage: 20,
      total: 1,
      totalPages: 1,
    });
  });
});

function asTransactionResponse(value: unknown): TransactionResponseBody {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('id' in value) ||
    typeof value.id !== 'string'
  ) {
    throw new Error('Unexpected transaction response');
  }

  return value as TransactionResponseBody;
}

function asTransactionHistoryResponse(
  value: unknown,
): TransactionHistoryResponseBody {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('data' in value) ||
    !Array.isArray(value.data) ||
    !('pagination' in value) ||
    typeof value.pagination !== 'object' ||
    value.pagination === null
  ) {
    throw new Error('Unexpected transaction history response');
  }

  return value as TransactionHistoryResponseBody;
}
