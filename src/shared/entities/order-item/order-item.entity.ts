import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import typeorm from "typeorm"
import { Order } from '../order/order.entity'; 
import { Product } from '../product/product.entity'; 
import { Articul } from '../articul/articul.entity'; 

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  productId: number;

  @Column()
  articulId: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ManyToOne(() => Order, order => order.orderItems, { lazy: true })
  @JoinColumn({ name: 'orderId' })
  order: typeorm.Relation<Order>;

  @ManyToOne(() => Product, { lazy: true })
  @JoinColumn({ name: 'productId' })
  product:  typeorm.Relation<Product>;

  @ManyToOne(() => Articul, (articul) => articul.orderItems, { lazy: true })
  @JoinColumn({ name: 'articulId' })
  articul: typeorm.Relation<Articul>;
}
