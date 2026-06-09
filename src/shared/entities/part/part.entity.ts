import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Material } from '../material/material.entity'; 
import { Color } from '../color/color.entity'; 
import { CategoryType } from '../custom-model/custom-model.entity'; 
import { part as PartType } from '../../enums/part.enum'; 

@Entity('parts')
export class Part {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: CategoryType })
  category: CategoryType;

  @Column({ type: 'enum', enum: PartType })
  part: PartType;

  @Column({ type: 'varchar', length: 128, nullable: true })
  title: string;

  @Column()
  materialId: number;

  @Column()
  colorId: number;

  @Column({ type: 'varchar', length: 256 })
  image: string;

  @ManyToOne(() => Material, (material) => material.parts, { lazy: true })
  @JoinColumn({ name: 'materialId' })
  material: Promise<Material>;

  @ManyToOne(() => Color, (color) => color.parts, { lazy: true })
  @JoinColumn({ name: 'colorId' })
  color: Promise<Color>;
}
