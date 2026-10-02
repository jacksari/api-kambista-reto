import { Injectable, Logger } from '@nestjs/common';
import { AppLogger, LogContext } from '../../application/ports/app-logger';

@Injectable()
export class NestAppLogger implements AppLogger {
  private readonly logger = new Logger('Application');

  log(event: string, context: LogContext = {}): void {
    this.logger.log({
      event,
      ...context,
    });
  }
}
