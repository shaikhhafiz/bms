import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(errors: string | string[]) {
    const message = Array.isArray(errors) ? errors : [errors];

    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message,
        error: 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
