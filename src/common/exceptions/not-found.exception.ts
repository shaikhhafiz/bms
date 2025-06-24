import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends HttpException {
  constructor(entityName: string, id?: string | number) {
    const message = id
      ? `${entityName} with ID ${id} not found`
      : `${entityName} not found`;

    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message,
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
