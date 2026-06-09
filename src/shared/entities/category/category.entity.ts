import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity'; 

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128, unique: true })
  title: string;

  @OneToMany(() => Product, (product) => product.category, { lazy: true })
  products: Promise<Product[]>;
}
