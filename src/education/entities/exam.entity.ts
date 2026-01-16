import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { ExamType } from '../enums/exam-type.enum';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 50 })
  type: string;

  @Column({ type: 'json' })
  content: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  validateType() {
    const validTypes = Object.values(ExamType);
    if (!validTypes.includes(this.type as ExamType)) {
      throw new Error(`Invalid exam type: ${this.type}. Valid types are: ${validTypes.join(', ')}`);
    }
  }
}
