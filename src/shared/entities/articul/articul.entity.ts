import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Product } from '../product/product.entity'; 
import { CarModel } from '../car-model/car-model.entity'; 
import { CartItem } from '../cart-item/cart-item.entity'; 
import { OrderItem } from '../order-item/order-item.entity'; 

@Entity('articuls')
export class Articul {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  carModelId: number;

  @ManyToOne(() => Product, (product) => product.articuls, { lazy: true })
  @JoinColumn({ name: 'productId' })
  product: Promise<Product>;

  @ManyToOne(() => CarModel, (model) => model.articuls, { lazy: true })
  @JoinColumn({ name: 'carModelId' })
  carModel: Promise<CarModel>;

  @OneToMany(() => CartItem, (cartItem) => cartItem.articul, { lazy: true })
  cartItems: Promise<CartItem[]>;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.articul, { lazy: true })
  orderItems: Promise<OrderItem[]>;
}
