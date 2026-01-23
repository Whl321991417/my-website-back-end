import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from './student.entity';
import { Subject } from './subject.entity';

@Entity('exam_records')
export class ExamRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @ManyToOne(() => Student, { nullable: false })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column()
  subjectId: number;

  @ManyToOne(() => Subject, { nullable: false })
  @JoinColumn({ name: 'subjectId' })
  subject: Subject;

  @Column({ type: 'decimal', precision: 5, scale: 1 })
  score: number;

  @Column({ nullable: true })
  examTime: Date;

  @Column({ type: 'json' })
  paperDetail: Record<string, any>;

  @Column({ type: 'json' })
  answerDetail: Record<string, any>[];

  @Column({ type: 'json' })
  knowledgePointDetails: Record<string, any>[];

  @Column({ default: 0 })
  status: number; // 0: 未考试, 1: 已交卷

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}