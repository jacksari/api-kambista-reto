const REQUIRED_VARIABLES = ['MONGODB_URI'] as const;

export function validateEnvironment(
  environment: Record<string, unknown>,
): Record<string, unknown> {
  for (const variable of REQUIRED_VARIABLES) {
    if (typeof environment[variable] !== 'string' || !environment[variable]) {
      throw new Error(`Missing required environment variable: ${variable}`);
    }
  }

  return {
    ...environment,
    PORT: positiveInteger(environment.PORT ?? 3000, 'PORT'),
    JWT_EXPIRES_IN_SECONDS: positiveInteger(
      environment.JWT_EXPIRES_IN_SECONDS ?? 3600,
      'JWT_EXPIRES_IN_SECONDS',
    ),
  };
}

function positiveInteger(value: unknown, variable: string): number {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${variable} must be a positive integer`);
  }

  return parsedValue;
}
