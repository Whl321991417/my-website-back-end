import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Teacher } from './teacher.entity';
import { Student } from './student.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 200, nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  subjectIds: number[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Teacher, (teacher) => teacher.class)
  teachers: Teacher[];

  @OneToMany(() => Student, (student) => student.class)
  students: Student[];
}
