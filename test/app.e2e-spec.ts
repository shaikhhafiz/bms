import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author } from '../src/authors/entities/author.entity';
import { Book } from '../src/books/entities/book.entity';

describe('Book Management System (e2e)', () => {
  let app: INestApplication;
  let authorId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();

    // Clear the database before tests
    const authorRepo = app.get(getRepositoryToken(Author));
    const bookRepo = app.get(getRepositoryToken(Book));
    await bookRepo.clear();
    await authorRepo.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authors API', () => {
    it('should create a new author', async () => {
      const createAuthorDto = {
        firstName: 'J.K.',
        lastName: 'Rowling',
        bio: 'British author best known for the Harry Potter series',
        birthDate: '1965-07-31',
      };

      const response = await request(app.getHttpServer())
        .post('/authors')
        .send(createAuthorDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.firstName).toBe(createAuthorDto.firstName);
      expect(response.body.lastName).toBe(createAuthorDto.lastName);
      expect(response.body.bio).toBe(createAuthorDto.bio);

      // Save author ID for later tests
      authorId = response.body.id;
    });

    it('should get all authors', async () => {
      const response = await request(app.getHttpServer())
        .get('/authors')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get a single author by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/authors/${authorId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', authorId);
    });

    it('should update an author', async () => {
      const updateAuthorDto = {
        bio: 'Updated bio for J.K. Rowling',
      };

      const response = await request(app.getHttpServer())
        .patch(`/authors/${authorId}`)
        .send(updateAuthorDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', authorId);
      expect(response.body.bio).toBe(updateAuthorDto.bio);
    });
  });

  describe('Books API', () => {
    let bookId: string;

    it('should create a new book', async () => {
      const createBookDto = {
        title: 'Harry Potter and the Philosopher\'s Stone',
        isbn: '978-0-7475-3269-9',
        publishedDate: '1997-06-26',
        genre: 'Fantasy',
        authorId,
      };

      const response = await request(app.getHttpServer())
        .post('/books')
        .send(createBookDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(createBookDto.title);
      expect(response.body.isbn).toBe(createBookDto.isbn);
      expect(response.body.genre).toBe(createBookDto.genre);
      expect(response.body.authorId).toBe(authorId);

      // Save book ID for later tests
      bookId = response.body.id;
    });

    it('should get all books', async () => {
      const response = await request(app.getHttpServer())
        .get('/books')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get a single book by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/books/${bookId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', bookId);
      expect(response.body).toHaveProperty('author');
      expect(response.body.author).toHaveProperty('id', authorId);
    });

    it('should update a book', async () => {
      const updateBookDto = {
        genre: 'Children\'s Fantasy',
      };

      const response = await request(app.getHttpServer())
        .patch(`/books/${bookId}`)
        .send(updateBookDto)
        .expect(200);

      expect(response.body).toHaveProperty('id', bookId);
      expect(response.body.genre).toBe(updateBookDto.genre);
    });

    it('should delete a book', async () => {
      await request(app.getHttpServer())
        .delete(`/books/${bookId}`)
        .expect(204);

      // Verify the book is deleted
      await request(app.getHttpServer())
        .get(`/books/${bookId}`)
        .expect(404);
    });
  });

  it('should delete an author', async () => {
    await request(app.getHttpServer())
      .delete(`/authors/${authorId}`)
      .expect(204);

    // Verify the author is deleted
    await request(app.getHttpServer())
      .get(`/authors/${authorId}`)
      .expect(404);
  });
});
