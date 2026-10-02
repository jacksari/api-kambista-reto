export type LogContext = Readonly<Record<string, unknown>>;

export interface AppLogger {
  log(event: string, context?: LogContext): void;
}
