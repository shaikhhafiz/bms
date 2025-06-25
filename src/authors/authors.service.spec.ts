import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { EntityNotFoundException } from '../common/exceptions/not-found.exception';

// Define a more specific mock repository type with required methods
type MockRepository<T = any> = {
  find: jest.Mock;
  findOne: jest.Mock;
  findAndCount: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
  delete: jest.Mock;
};

const createMockRepository = (): MockRepository => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('AuthorsService', () => {
  let service: AuthorsService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getRepositoryToken(Author),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    repository = module.get<MockRepository<Author>>(getRepositoryToken(Author));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return an author', async () => {
      const createAuthorDto = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Test bio',
        birthDate: '1990-01-01',
      };

      const author = {
        id: 'test-id',
        ...createAuthorDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        books: [],
      };

      repository.create.mockReturnValue(author);
      repository.save.mockResolvedValue(author);

      const result = await service.create(createAuthorDto);
      expect(result).toEqual(author);
      expect(repository.create).toHaveBeenCalledWith(createAuthorDto);
      expect(repository.save).toHaveBeenCalledWith(author);
    });
  });

  describe('findAll', () => {
    it('should return an array of authors and count', async () => {
      const authors = [
        {
          id: 'test-id',
          firstName: 'John',
          lastName: 'Doe',
          bio: 'Test bio',
          birthDate: new Date('1990-01-01'),
          createdAt: new Date(),
          updatedAt: new Date(),
          books: [],
        },
      ];

      repository.findAndCount.mockResolvedValue([authors, 1]);

      const result = await service.findAll();
      expect(result).toEqual([authors, 1]);
    });
  });

  describe('findOne', () => {
    it('should return a single author', async () => {
      const author = {
        id: 'test-id',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Test bio',
        birthDate: new Date('1990-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
        books: [],
      };

      repository.findOne.mockResolvedValue(author);

      const result = await service.findOne('test-id');
      expect(result).toEqual(author);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        relations: ['books'],
      });
    });

    it('should throw NotFoundException if author not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(EntityNotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return an author', async () => {
      const updateAuthorDto = {
        firstName: 'Updated',
        lastName: 'Author',
      };

      const existingAuthor = {
        id: 'test-id',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Test bio',
        birthDate: new Date('1990-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
        books: [],
      };

      const updatedAuthor = {
        ...existingAuthor,
        ...updateAuthorDto,
      };

      repository.findOne.mockResolvedValue(existingAuthor);
      repository.save.mockResolvedValue(updatedAuthor);

      const result = await service.update('test-id', updateAuthorDto);

      expect(result).toEqual(updatedAuthor);
      expect(repository.save).toHaveBeenCalledWith({
        ...existingAuthor,
        ...updateAuthorDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete an author and return void', async () => {
      repository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove('test-id')).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException if author not found during deletion', async () => {
      repository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('non-existent-id')).rejects.toThrow(EntityNotFoundException);
    });
  });
});
