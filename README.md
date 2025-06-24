# Book Management System - Database Options

## Database Recommendations for Book Management System

### 2. PostgreSQL
- **Pros**:
  - Excellent for complex queries and data relationships
  - Strong support for JSON data if needed
  - Robust transactional support
  - Excellent TypeORM support (compatible with NestJS app)
  - Ideal for production environments
  - Advanced features like full-text search (useful for book/author search)
- **Cons**:
  - Requires separate server setup
  - More configuration compared to SQLite

## Recommendation

**For development**: Continue using SQLite as it's already configured and provides simplicity.

**For production**: Consider migrating to PostgreSQL for the following reasons:
- Book management system has clear relational data (authors and books)
- PostgreSQL's full-text search capabilities will enhance book/author search functionality
- Better scalability and concurrent access for multiple users
- Advanced features as application grows

## API Documentation with Swagger

This application is configured with Swagger for API documentation and testing. Swagger provides a user-friendly interface to explore and interact with the API endpoints.

### How to Access Swagger UI

1. Start the application:
   ```bash
   npm run start
   ```
   or for development with auto-reload:
   ```bash
   npm run start:dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/api
   ```

### Using Swagger UI

The Swagger UI provides the following features:

- **API Overview**: View all available endpoints organized by tags (authors and books)
- **Request Details**: Each endpoint displays required parameters, request body schema, and response types
- **Try It Out**: Test API endpoints directly from the browser
- **Authorization**: If auth is implemented, you can authenticate requests from the UI
- **Response Examples**: See example responses for each endpoint

### API Endpoints Documentation

The API is organized into the following categories:

1. **Authors** - Endpoints for managing authors:
   - GET `/authors` - List all authors
   - GET `/authors/:id` - Get author by ID
   - POST `/authors` - Create a new author
   - PATCH `/authors/:id` - Update an author
   - DELETE `/authors/:id` - Delete an author

2. **Books** - Endpoints for managing books:
   - GET `/books` - List all books
   - GET `/books/:id` - Get book by ID
   - POST `/books` - Create a new book
   - PATCH `/books/:id` - Update a book
   - DELETE `/books/:id` - Delete a book

### Swagger Configuration

The Swagger configuration can be found in `src/main.ts`. It's set up with the following details:

- **Title**: Book Management System API
- **Description**: RESTful API for managing books and authors
- **Version**: 1.0
- **Tags**: 'authors' and 'books' for better organization

### Extending Swagger Documentation

To improve API documentation for new endpoints or DTOs:
1. Use Swagger decorators in controller files
2. Add `@ApiProperty()` decorators to DTO properties
3. Use `@ApiOperation()` and `@ApiResponse()` decorators for detailed endpoint documentation
