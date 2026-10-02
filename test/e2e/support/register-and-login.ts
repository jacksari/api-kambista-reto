import { randomUUID } from 'node:crypto';
import { Server } from 'node:http';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

interface AuthResponseBody {
  access_token: string;
}

export async function registerAndLogin(
  app: INestApplication<Server>,
  scenario: string,
): Promise<string> {
  const email = `${scenario}-${randomUUID()}@example.com`;
  const password = 'StrongPassword123';

  await request(app.getHttpServer())
    .post('/v1/auth/register')
    .send({
      nombre: 'E2E Transaction User',
      email,
      password,
    })
    .expect(201);

  const loginResponse = await request(app.getHttpServer())
    .post('/v1/auth/login')
    .send({ email, password })
    .expect(200);

  return asAuthResponse(loginResponse.body as unknown).access_token;
}

function asAuthResponse(value: unknown): AuthResponseBody {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('access_token' in value) ||
    typeof value.access_token !== 'string'
  ) {
    throw new Error('Unexpected authentication response');
  }

  return value as AuthResponseBody;
}
