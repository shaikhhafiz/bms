import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Author } from '../authors/entities/author.entity';

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
      throw new BadRequestException(`Author with ID ${createBookDto.authorId} not found`);
    }

    const book = this.booksRepository.create(createBookDto);
    return await this.booksRepository.save(book);
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
      throw new NotFoundException(`Book with ID ${id} not found`);
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
        throw new BadRequestException(`Author with ID ${updateBookDto.authorId} not found`);
      }
    }

    Object.assign(book, updateBookDto);

    return await this.booksRepository.save(book);
  }

  async remove(id: string): Promise<void> {
    const result = await this.booksRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }
}
