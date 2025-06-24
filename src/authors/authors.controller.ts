import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new author' })
  @ApiResponse({ status: 201, description: 'The author has been successfully created.', type: Author })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid data provided.' })
  create(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all authors' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', type: Number })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for firstName or lastName', type: String })
  @ApiResponse({ status: 200, description: 'Return the list of authors.' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    const [authors, total] = await this.authorsService.findAll(page, limit, search);
    return {
      data: authors,
      meta: {
        total,
        page: page || 1,
        limit: limit || 10,
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a author by ID' })
  @ApiParam({ name: 'id', description: 'Author ID', type: String })
  @ApiResponse({ status: 200, description: 'Return the author.', type: Author })
  @ApiResponse({ status: 404, description: 'Author not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Author> {
    return this.authorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an author' })
  @ApiParam({ name: 'id', description: 'Author ID', type: String })
  @ApiResponse({ status: 200, description: 'The author has been successfully updated.', type: Author })
  @ApiResponse({ status: 404, description: 'Author not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid data provided.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    return this.authorsService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an author' })
  @ApiParam({ name: 'id', description: 'Author ID', type: String })
  @ApiResponse({ status: 204, description: 'The author has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Author not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.authorsService.remove(id);
  }
}
