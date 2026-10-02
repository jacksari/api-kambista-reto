import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: false,
      colors: true,
      logLevels: ['log', 'warn', 'error', 'debug'],
    }),
  });
  const config = app.get(ConfigService);
  const corsOrigins = config
    .get<string>('CORS_ORIGINS', 'http://localhost:3001')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.setGlobalPrefix('v1');

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Kambista API')
    .setDescription('API for authentication, exchange rates, and transactions')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, swaggerDocument, {
    useGlobalPrefix: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(config.getOrThrow<number>('PORT'));
}

void bootstrap();
