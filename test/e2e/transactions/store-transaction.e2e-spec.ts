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
  monedaOrigen: string;
  monedaDestino: string;
  monto: number;
  montoCambiado: number;
  tipoCambio: number;
  fecha: string;
}

describe('Store transaction (e2e)', () => {
  let testApplication: E2eTestApplication;
  let app: INestApplication<Server>;

  beforeAll(async () => {
    testApplication = await createE2eTestApplication();
    app = testApplication.app;
  });

  afterAll(async () => {
    await testApplication.close();
  });

  it('stores a currency exchange transaction', async () => {
    const token = await registerAndLogin(app, 'store-transaction');

    const response = await request(app.getHttpServer())
      .post('/v1/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        monedaOrigen: 'USD',
        monedaDestino: 'PEN',
        monto: 100,
      })
      .expect(201);
    const transaction = asTransactionResponse(response.body as unknown);

    expect(typeof transaction.id).toBe('string');
    expect(typeof transaction.fecha).toBe('string');
    expect(transaction).toMatchObject({
      monedaOrigen: 'USD',
      monedaDestino: 'PEN',
      monto: 100,
      montoCambiado: 380,
      tipoCambio: 3.8,
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
