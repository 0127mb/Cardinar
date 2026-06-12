import * as typeorm from 'typeorm';
import { Request } from '../request/request.entity';

@typeorm.Entity('users')
export class User {
  @typeorm.PrimaryGeneratedColumn()
  id: number;

  @typeorm.Column({ type: 'varchar', length: 64 })
  fullName: string;

  @typeorm.Column({ type: 'varchar', length: 16, unique: true })
  phoneNumber: string;

  @typeorm.Column({ type: 'varchar', length: 64 })
  email: string;

  @typeorm.Column({ type: 'varchar', length: 128 })
  password: string;

  @typeorm.Column({ type: 'varchar', length: 512, nullable: true })
  profileImage?: string;

  @typeorm.Column({ type: 'bool', default: false })
  isAdmin: boolean;
  @typeorm.Column({ type: 'bool', default: false })
  isActive: boolean;

  @typeorm.OneToMany(() => Request, (request) => request.user, { lazy: true })
  requests: typeorm.Relation<Request[]>;
  @typeorm.OneToMany('Order', 'user', { lazy: true })
  orders: typeorm.Relation<any>;
}
