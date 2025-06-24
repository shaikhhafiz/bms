import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Book } from '../../books/entities/book.entity';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsbnUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(isbn: string, args: ValidationArguments) {
    const book = await this.dataSource
      .getRepository(Book)
      .findOne({ where: { isbn } });
    return !book; // Return true if no book with this ISBN exists
  }

  defaultMessage(args: ValidationArguments) {
    return `ISBN "${args.value}" is already in use`;
  }
}

export function IsbnUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsbnUniqueConstraint,
    });
  };
}
