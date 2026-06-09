import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../category/category.entity'; 
import { Image } from '../image/image.entity'; 
import { Articul } from '../articul/articul.entity'; 
import { ProductColor } from '../product-color/product-color.entity';

export enum ProductStatus {
  NEW = 'new',
  SALE = 'sale',
  HIT = 'hit',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryId: number;

  @Column({ type: 'varchar', length: 128, unique: true })
  title: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ProductStatus, nullable: true })
  status: ProductStatus;

  @Column({ type: 'bool', default: false })
  isPremium: boolean;

  @ManyToOne(() => Category, (category) => category.products, { lazy: true })
  @JoinColumn({ name: 'categoryId' })
  category: Promise<Category>;

  @OneToMany(() => Image, (image) => image.product, { lazy: true })
  images: Promise<Image[]>;

  @OneToMany(() => Articul, (articul) => articul.product, { lazy: true })
  articuls: Promise<Articul[]>;

  @OneToMany(() => ProductColor, (pc) => pc.product, { lazy: true })
  productColors: Promise<ProductColor[]>;
}
