import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../user/user.entity';
@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 64 })
  fullName: string;
  @Column({ type: 'varchar', length: 16 })
  phoneNumber: string;
  @Column({ type: 'varchar', length: 64, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  comments: string | null;

  @Column({ nullable: true })
  userId: number | null;

  @ManyToOne(() => User, user => user.requests, { lazy: true, nullable: true })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;
}
