import { IsString, IsOptional, IsDateString, IsISBN, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookDto {
  @ApiProperty({ description: 'Title of the book', required: false, example: 'Updated Novel Title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'ISBN of the book', required: false, example: '978-3-16-148410-0' })
  @IsOptional()
  @IsISBN()
  isbn?: string;

  @ApiProperty({ description: 'Publication date of the book', required: false, example: '2023-01-01' })
  @IsOptional()
  @IsDateString()
  publishedDate?: string;

  @ApiProperty({ description: 'Genre of the book', required: false, example: 'Science Fiction' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({ description: 'ID of the author', required: false, example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  authorId?: string;
}
