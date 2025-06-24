import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Author } from '../../authors/entities/author.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

@Entity('books')
export class Book {
  @ApiProperty({ description: 'Unique identifier', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Title of the book', example: 'The Great Novel' })
  @Column({ nullable: false })
  title: string;

  @ApiProperty({ description: 'ISBN of the book', example: '978-3-16-148410-0' })
  @Column({ nullable: false, unique: true })
  isbn: string;

  @ApiProperty({ description: 'Publication date of the book', example: '2023-01-01', nullable: true })
  @Column({ type: 'date', nullable: true })
  publishedDate: Date;

  @ApiProperty({ description: 'Genre of the book', example: 'Fantasy', nullable: true })
  @Column({ nullable: true })
  genre: string;

  @ApiProperty({ description: 'Author of the book', type: () => Author })
  @ManyToOne(() => Author, author => author.books, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  @IsNotEmpty({ message: 'Author is required' })
  author: Author;

  @ApiProperty({ description: 'Author ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @Column()
  @IsNotEmpty({ message: 'Author ID is required' })
  authorId: string;

  @ApiProperty({ description: 'Date when the book was created', example: '2023-06-21T12:00:00Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the book was last updated', example: '2023-06-21T14:30:00Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
