import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('authors')
export class Author {
  @ApiProperty({ description: 'Unique identifier', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'First name of the author', example: 'John' })
  @Column({ nullable: false })
  firstName: string;

  @ApiProperty({ description: 'Last name of the author', example: 'Doe' })
  @Column({ nullable: false })
  lastName: string;

  @ApiProperty({ description: 'Biography of the author', example: 'A renowned writer...', nullable: true })
  @Column({ nullable: true })
  bio: string;

  @ApiProperty({ description: 'Birth date of the author', example: '1990-01-01', nullable: true })
  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @ApiProperty({ description: 'Books written by this author', type: [Book] })
  @OneToMany(() => Book, book => book.author)
  books: Book[];

  @ApiProperty({ description: 'Date when the author was created', example: '2023-06-21T12:00:00Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the author was last updated', example: '2023-06-21T14:30:00Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
