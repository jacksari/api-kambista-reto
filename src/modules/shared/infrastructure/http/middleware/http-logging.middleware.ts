import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

@Injectable()
export class HttpLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(HttpLoggingMiddleware.name);

  use(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): void {
    const startedAt = Date.now();

    response.once('finish', () => {
      this.logger.log({
        event: 'http_request_completed',
        userId: request.user?.id ?? null,
        method: request.method,
        endpoint: request.originalUrl.split('?')[0],
        statusCode: response.statusCode,
        durationMs: Date.now() - startedAt,
      });
    });

    next();
  }
}
