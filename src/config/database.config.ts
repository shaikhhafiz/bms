import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'book_management.sqlite',
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  synchronize: true, // Set to false in production
};
