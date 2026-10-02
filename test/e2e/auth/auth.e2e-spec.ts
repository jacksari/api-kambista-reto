import { randomUUID } from 'node:crypto';
import { Server } from 'node:http';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  createE2eTestApplication,
  E2eTestApplication,
} from '../support/e2e-test-application';

interface AuthResponseBody {
  access_token: string;
  usuario: {
    id: string;
    nombre: string;
    email: string;
    rol: string;
  };
}

describe('Authentication (e2e)', () => {
  let testApplication: E2eTestApplication;
  let app: INestApplication<Server>;

  const password = 'StrongPassword123';

  beforeAll(async () => {
    testApplication = await createE2eTestApplication();
    app = testApplication.app;
  });

  afterAll(async () => {
    await testApplication.close();
  });

  it('registers a user', async () => {
    const email = uniqueEmail('register');
    const response = await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({
        nombre: 'Register User',
        email,
        password,
      })
      .expect(201);
    const body = asAuthResponse(response.body as unknown);

    expect(typeof body.access_token).toBe('string');
    expect(typeof body.usuario.id).toBe('string');
    expect(body.usuario).toMatchObject({
      nombre: 'Register User',
      email,
      rol: 'user',
    });
  });

  it('rejects a duplicated email', async () => {
    const email = uniqueEmail('duplicated');
    const registration = {
      nombre: 'Duplicated User',
      email,
      password,
    };

    await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send(registration)
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send(registration)
      .expect(409);

    expect(response.body as unknown).toEqual({
      code: 'USER_ALREADY_EXISTS',
      message: 'A user with this email already exists',
    });
  });

  it('authenticates a registered user', async () => {
    const email = uniqueEmail('login');

    await registerUser(app, {
      nombre: 'Login User',
      email,
      password,
    });

    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({ email, password })
      .expect(200);
    const body = asAuthResponse(response.body as unknown);

    expect(typeof body.access_token).toBe('string');
    expect(typeof body.usuario.id).toBe('string');
    expect(body.usuario).toMatchObject({
      nombre: 'Login User',
      email,
      rol: 'user',
    });
  });

  it('rejects invalid login credentials', async () => {
    const email = uniqueEmail('invalid-login');

    await registerUser(app, {
      nombre: 'Invalid Login User',
      email,
      password,
    });

    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({
        email,
        password: 'OtherPassword',
      })
      .expect(401);

    expect(response.body as unknown).toEqual({
      code: 'INVALID_CREDENTIALS',
      message: 'Email or password is incorrect',
    });
  });
});

function uniqueEmail(scenario: string): string {
  return `${scenario}-${randomUUID()}@example.com`;
}

async function registerUser(
  app: INestApplication<Server>,
  registration: {
    nombre: string;
    email: string;
    password: string;
  },
): Promise<void> {
  await request(app.getHttpServer())
    .post('/v1/auth/register')
    .send(registration)
    .expect(201);
}

function asAuthResponse(value: unknown): AuthResponseBody {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('access_token' in value) ||
    typeof value.access_token !== 'string' ||
    !('usuario' in value) ||
    typeof value.usuario !== 'object' ||
    value.usuario === null
  ) {
    throw new Error('Unexpected authentication response');
  }

  return value as AuthResponseBody;
}
