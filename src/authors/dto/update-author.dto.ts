import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuthorDto {
  @ApiProperty({ description: 'First name of the author', required: false, example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Last name of the author', required: false, example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Biography of the author', required: false, example: 'A brief bio about the author' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ description: 'Birth date of the author', required: false, example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
