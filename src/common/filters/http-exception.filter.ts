import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    // Handle HttpExceptions (including our custom exceptions)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      if (typeof exceptionResponse === 'object') {
        message = exceptionResponse.message || exception.message;
        error = exceptionResponse.error || 'Error';
      } else {
        message = exceptionResponse || exception.message;
      }
    }
    // Handle TypeORM specific errors
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;

      // Handle unique constraint violations
      if (exception.message.includes('UNIQUE constraint failed')) {
        status = HttpStatus.CONFLICT;
        error = 'Conflict';

        // Extract the field name from the error message
        const match = exception.message.match(/UNIQUE constraint failed: (\w+)\.(\w+)/);
        if (match && match[2]) {
          const field = match[2];
          message = `A record with this ${field} already exists`;
        } else {
          message = 'A record with these details already exists';
        }
      } else {
        error = 'Database Error';
        message = 'An error occurred while processing your request';
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
