import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';

export enum BranchType {
  OFFICIAL = 'official',
  PARTNER = 'partner',
}

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128 })
  title: string;

  @Column({ type: 'varchar', length: 128 })
  address: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  district: string;

  @Column({ type: 'varchar', length: 64 })
  region: string;

  @Column({ type: 'varchar', length: 16 })
  phoneNumber: string;

  @Column({ type: 'decimal', precision: 12, scale: 9 })
  longitude: number;

  @Column({ type: 'decimal', precision: 12, scale: 9 })
  latitude: number;

  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: BranchType })
  branchType: BranchType;

  @OneToMany('Order', 'branch', { lazy: true })
  orders: Relation<any>;
}
