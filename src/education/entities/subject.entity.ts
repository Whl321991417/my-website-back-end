import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { KnowledgePoint } from './knowledge-point.entity';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 200, nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => KnowledgePoint, knowledgePoint => knowledgePoint.subject)
  knowledgePoints: KnowledgePoint[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
