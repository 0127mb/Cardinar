import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, } from 'typeorm';
import typeorm from "typeorm"
import { orderStatus } from '../../enums/orderStatus.enum';
import { User } from '../user/user.entity';
import { Branch } from '../branch/branch.entity';
import { OrderItem } from '../order-item/order-item.entity';
import { paymentMethod } from '../../enums/paymendMethod.enum';
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;



  @Column({ type: 'varchar', length: 64 })
  fullName: string;

  @Column({ type: 'varchar', length: 16 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  email: string;

  @Column({ type: 'bool' })
  delivery: boolean;

  @Column({ type: 'enum', enum: paymentMethod })
  paymentMethod: paymentMethod;

  @Column({ type: 'enum', enum: orderStatus })
  status: orderStatus;

  @ManyToOne(() => User, user => user.orders, { lazy: true })
  user: User;

  @ManyToOne(
    () => Branch,
    branch => branch.orders,
  )
  branch: Branch;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { lazy: true })
  orderItems: typeorm.Relation<OrderItem[]>;
}
