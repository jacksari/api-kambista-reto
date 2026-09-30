import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApplicationError,
  ApplicationErrorCategory,
} from '../../../application/errors/application.error';
import { DomainError } from '../../../domain/errors/domain.error';

interface ErrorResponse {
  code: string;
  message: string | string[];
}

const APPLICATION_ERROR_STATUS: Readonly<
  Record<ApplicationErrorCategory, HttpStatus>
> = {
  'bad-request': HttpStatus.BAD_REQUEST,
  conflict: HttpStatus.CONFLICT,
  forbidden: HttpStatus.FORBIDDEN,
  'not-found': HttpStatus.NOT_FOUND,
  unauthorized: HttpStatus.UNAUTHORIZED,
  unavailable: HttpStatus.SERVICE_UNAVAILABLE,
  unprocessable: HttpStatus.UNPROCESSABLE_ENTITY,
};

const HTTP_ERROR_CODES: Readonly<Record<number, string>> = {
  [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.CONFLICT]: 'CONFLICT',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
  [HttpStatus.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof ApplicationError) {
      response.status(APPLICATION_ERROR_STATUS[exception.category]).json({
        code: exception.code,
        message: exception.message,
      } satisfies ErrorResponse);
      return;
    }

    if (exception instanceof DomainError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        code: exception.code,
        message: exception.message,
      } satisfies ErrorResponse);
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : this.httpExceptionMessage(exceptionResponse, exception.message);

      response.status(status).json({
        code: HTTP_ERROR_CODES[status] ?? 'HTTP_ERROR',
        message,
      } satisfies ErrorResponse);
      return;
    }

    this.logger.error(
      'Unexpected application error',
      exception instanceof Error ? exception.stack : undefined,
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
    } satisfies ErrorResponse);
  }

  private httpExceptionMessage(
    response: object,
    fallback: string,
  ): string | string[] {
    if ('message' in response) {
      const message = response.message;

      if (
        typeof message === 'string' ||
        (Array.isArray(message) &&
          message.every((item): item is string => typeof item === 'string'))
      ) {
        return message;
      }
    }

    return fallback;
  }
}
