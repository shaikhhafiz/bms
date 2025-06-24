import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Author } from './entities/author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { EntityNotFoundException } from '../common/exceptions/not-found.exception';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const author = this.authorsRepository.create(createAuthorDto);
    return await this.authorsRepository.save(author);
  }

  async findAll(page = 1, limit = 10, search?: string): Promise<[Author[], number]> {
    const where: FindOptionsWhere<Author> = {};

    if (search) {
      where.firstName = Like(`%${search}%`);
      where.lastName = Like(`%${search}%`);
    }

    return await this.authorsRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      relations: ['books'],
    });
  }

  async findOne(id: string): Promise<Author> {
    const author = await this.authorsRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new EntityNotFoundException('Author', id);
    }

    return author;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.findOne(id);

    Object.assign(author, updateAuthorDto);

    return await this.authorsRepository.save(author);
  }

  async remove(id: string): Promise<void> {
    const result = await this.authorsRepository.delete(id);

    if (result.affected === 0) {
      throw new EntityNotFoundException('Author', id);
    }
  }
}
