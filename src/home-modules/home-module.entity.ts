import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HomeModule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  icon: string;

  @Column()
  name: string;

  @Column('text')
  detail: string;

  @Column()
  actionName: string;

  @Column({ nullable: true })
  route: string;

  @Column({ nullable: true })
  jumpUrl: string;

  @Column()
  image: string;

  @Column('text')
  modulePosition: string;

  @Column('simple-array')
  coreHighlights: string[];

  @Column('text')
  scenarioValue: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}