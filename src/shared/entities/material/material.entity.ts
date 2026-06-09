import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Part } from '../part/part.entity'; 

@Entity('materials')
export class Material {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, unique: true })
  title: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  description: string;

  @OneToMany(() => Part, (part) => part.material, { lazy: true })
  parts: Promise<Part[]>;
}
