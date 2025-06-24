import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID, IsISBN } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ description: 'Title of the book', example: 'The Great Novel' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'ISBN of the book', example: '978-3-16-148410-0' })
  @IsNotEmpty()
  @IsISBN()
  isbn: string;

  @ApiProperty({ description: 'Publication date of the book', required: false, example: '2023-01-01' })
  @IsOptional()
  @IsDateString()
  publishedDate?: string;

  @ApiProperty({ description: 'Genre of the book', required: false, example: 'Fantasy' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({ description: 'ID of the author', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  authorId: string;
}
