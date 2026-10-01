export const EXCHANGE_RATE_TOKENS = {
  idGenerator: Symbol('ExchangeRateIdGenerator'),
  provider: Symbol('ExchangeRateProvider'),
  repository: Symbol('ExchangeRateRepository'),
  cache: Symbol('ExchangeRateCache'),
} as const;
