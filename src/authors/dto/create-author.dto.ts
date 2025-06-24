import { IsString, IsOptional, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({ description: 'First name of the author', example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the author', example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Biography of the author', required: false, example: 'A brief bio about the author' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ description: 'Birth date of the author', required: false, example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
