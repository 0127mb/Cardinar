import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import typeorm from "typeorm"
import { User } from '../user/user.entity';

export enum OtpType {
  REGISTER = 'register',
  LOGIN = 'login',
}

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'varchar', length: 64 })
  token: string; // unique UUID token for the link

  @Column({ type: 'enum', enum: OtpType })
  type: OtpType;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ type: 'bool', default: false })
  isUsed: boolean;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { lazy: true })
 
  user: typeorm.Relation<User>;
}
