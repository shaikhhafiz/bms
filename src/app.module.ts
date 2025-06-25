import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { Author } from './authors/entities/author.entity';
import { Book } from './books/entities/book.entity';
import { AuthorsController } from './authors/authors.controller';
import { BooksController } from './books/books.controller';
import { AuthorsService } from './authors/authors.service';
import { BooksService } from './books/books.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Author, Book]),
  ],
  controllers: [AppController, AuthorsController, BooksController],
  providers: [AppService, AuthorsService, BooksService],
})
export class AppModule {}
