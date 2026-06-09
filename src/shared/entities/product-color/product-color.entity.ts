import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../product/product.entity';
import { Color } from '../color/color.entity'; 

@Entity('product_colors')
export class ProductColor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  colorId: number;

  @ManyToOne(() => Product, (product) => product.productColors, { lazy: true })
  @JoinColumn({ name: 'productId' })
  product: Promise<Product>;

  @ManyToOne(() => Color, (color) => color.productColors, { lazy: true })
  @JoinColumn({ name: 'colorId' })
  color: Promise<Color>;
}
