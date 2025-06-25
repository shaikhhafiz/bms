import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, QueryFailedError } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Author } from '../authors/entities/author.entity';
import { EntityNotFoundException } from '../common/exceptions/not-found.exception';
import { ConflictException } from '../common/exceptions/conflict.exception';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    // Check if author exists
    const author = await this.authorsRepository.findOne({
      where: { id: createBookDto.authorId },
    });

    if (!author) {
      throw new BadRequestException(`The specified author does not exist`);
    }

    // Check if a book with the same ISBN already exists
    const existingBook = await this.booksRepository.findOne({
      where: { isbn: createBookDto.isbn }
    });

    if (existingBook) {
      throw new ConflictException(`Book with ISBN '${createBookDto.isbn}' already exists`);
    }

    const book = this.booksRepository.create(createBookDto);

    try {
      return await this.booksRepository.save(book);
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('UNIQUE constraint failed: books.isbn')) {
        throw new ConflictException(`Book with ISBN '${createBookDto.isbn}' already exists`);
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 10, search?: string, authorId?: string): Promise<[Book[], number]> {
    let where: any = {};

    if (search) {
      // Create OR conditions for title and ISBN search
      where = [
        { title: Like(`%${search}%`) },
        { isbn: Like(`%${search}%`) }
      ];

      // Apply authorId filter to both conditions if provided
      if (authorId) {
        where = where.map(condition => ({
          ...condition,
          authorId
        }));
      }
    } else if (authorId) {
      // If only authorId is provided (no search)
      where = { authorId };
    }

    return await this.booksRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      relations: ['author'],
    });
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!book) {
      throw new EntityNotFoundException('Book', id);
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    // If authorId is provided, check if author exists
    if (updateBookDto.authorId) {
      const author = await this.authorsRepository.findOne({
        where: { id: updateBookDto.authorId },
      });

      if (!author) {
        throw new BadRequestException(`The specified author does not exist`);
      }
    }

    // If ISBN is being updated, check if it's already in use by another book
    if (updateBookDto.isbn && updateBookDto.isbn !== book.isbn) {
      const existingBook = await this.booksRepository.findOne({
        where: { isbn: updateBookDto.isbn }
      });

      if (existingBook) {
        throw new ConflictException(`Book with ISBN '${updateBookDto.isbn}' already exists`);
      }
    }

    Object.assign(book, updateBookDto);

    try {
      return await this.booksRepository.save(book);
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('UNIQUE constraint failed: books.isbn')) {
        throw new ConflictException(`Book with ISBN '${updateBookDto.isbn}' already exists`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.booksRepository.delete(id);

    if (result.affected === 0) {
      throw new EntityNotFoundException('Book', id);
    }
  }
}
