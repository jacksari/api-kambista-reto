export const TRANSACTION_TOKENS = {
    exchangeRateReader: Symbol('ExchangeRateReader'),
    idGenerator: Symbol('TransactionIdGenerator'),
    repository: Symbol('TransactionRepository'),
} as const;