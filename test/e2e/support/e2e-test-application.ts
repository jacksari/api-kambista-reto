import { Server } from 'node:http';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { EXCHANGE_RATE_TOKENS } from '../../../src/modules/exchange-rates/infrastructure/dependency-injection/exchange-rate.tokens';
import { fakeExchangeRateProvider } from '../fakes/exchange-rate-provider.fake';

export interface E2eTestApplication {
  app: INestApplication<Server>;
  close: () => Promise<void>;
}

export async function createE2eTestApplication(): Promise<E2eTestApplication> {
  const mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.JWT_SECRET = 'e2e-test-secret-with-at-least-32-characters';
  process.env.JWT_EXPIRES_IN_SECONDS = '3600';

  const { AppModule } = await import('../../../src/app.module');
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(EXCHANGE_RATE_TOKENS.provider)
    .useValue(fakeExchangeRateProvider)
    .compile();

  const app = moduleRef.createNestApplication<INestApplication<Server>>({
    logger: false,
  });
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  await app.init();

  return {
    app,
    close: async () => {
      await app.close();
      await mongoServer.stop();
    },
  };
}
