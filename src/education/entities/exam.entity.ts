import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn } from 'typeorm';
import { ExamType } from '../enums/exam-type.enum';
import { Subject } from './subject.entity';

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

  @ManyToOne(() => Subject, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'subjectId' })
  subject: Subject;

  @Column({ nullable: true })
  subjectId: number;

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
