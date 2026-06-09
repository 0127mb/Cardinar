import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../product/product.entity'; 
import { Articul } from '../articul/articul.entity'; 

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  articulId: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ManyToOne(() => Product, { lazy: true })
  @JoinColumn({ name: 'productId' })
  product: Promise<Product>;

  @ManyToOne(() => Articul, (articul) => articul.cartItems, { lazy: true })
  @JoinColumn({ name: 'articulId' })
  articul: Promise<Articul>;
}
