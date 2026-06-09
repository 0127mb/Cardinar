import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../product/product.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column({ type: 'varchar', length: 256 })
  image: string;

  @Column({ type: 'int' })
  position: number;

  @ManyToOne(() => Product, (product) => product.images, { lazy: true })
  @JoinColumn({ name: 'productId' })
  product: Promise<Product>;
}
