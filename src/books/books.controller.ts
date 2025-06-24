import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'The book has been successfully created.', type: Book })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid data or author not found.' })
  create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', type: Number })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for title or ISBN', type: String })
  @ApiQuery({ name: 'authorId', required: false, description: 'Filter by author ID', type: String })
  @ApiResponse({ status: 200, description: 'Return the list of books.' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('authorId') authorId?: string,
  ) {
    const [books, total] = await this.booksService.findAll(page, limit, search, authorId);
    return {
      data: books,
      meta: {
        total,
        page: page || 1,
        limit: limit || 10,
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiParam({ name: 'id', description: 'Book ID', type: String })
  @ApiResponse({ status: 200, description: 'Return the book.', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiParam({ name: 'id', description: 'Book ID', type: String })
  @ApiResponse({ status: 200, description: 'The book has been successfully updated.', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid data or author not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a book' })
  @ApiParam({ name: 'id', description: 'Book ID', type: String })
  @ApiResponse({ status: 204, description: 'The book has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.booksService.remove(id);
  }
}
