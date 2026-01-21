import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('case_libraries')
export class CaseLibrary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'case_id',
    type: 'varchar',
    length: 255,
    unique: true,
    comment: '案例唯一标识',
  })
  caseId: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '案例标题',
  })
  title: string;

  @Column({
    type: 'text',
    comment: '案例描述',
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '案例图片URL',
  })
  image: string;

  @Column({
    type: 'varchar',
    length: 500,
    comment: '案例跳转URL',
  })
  url: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
    comment: '是否启用',
  })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    comment: '更新时间',
  })
  updatedAt: Date;
}
