import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductColor } from '../product-color/product-color.entity'; 
import { Part } from '../part/part.entity'; 

@Entity('colors')
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, unique: true })
  title: string;

  @Column({ type: 'varchar', length: 12, unique: true })
  color: string;

  @OneToMany(() => ProductColor, (pc) => pc.color, { lazy: true })
  productColors: Promise<ProductColor[]>;

  @OneToMany(() => Part, (part) => part.color, { lazy: true })
  parts: Promise<Part[]>;
}
