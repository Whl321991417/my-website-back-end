import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('text')
  content: string;

  @Column('simple-array')
  tags: string[];

  @Column({
    default: 'https://fastly.picsum.photos/id/662/320/320.jpg?hmac=Fs_cSStFur6FQB5TP9KPbjqOlgNSaiap-umQn12HzF0'
  })
  cover: string;

  @Column({ default: '南风' })
  author: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}