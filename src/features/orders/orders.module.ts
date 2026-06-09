import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../shared/entities/order/order.entity'; 
import { OrderItem } from '../../shared/entities/order-item/order-item.entity';
import { Product } from '../../shared/entities/product/product.entity';
import { Articul } from '../../shared/entities/articul/articul.entity';
import { OrdersController } from './controller/orders.controller';
import { CreateOrderHandler } from './commands/create-order/create-order.handler';
import { UpdateOrderStatusHandler } from './commands/update-order-status/update-order-status.handler';
import { DeleteOrderHandler } from './commands/delete-order/delete-order.handler';
import { GetAllOrdersHandler } from './queries/get-all-orders/get-all-orders.handler';
import { GetOrderByIdHandler } from './queries/get-order-by-id/get-order-by-id.handler';

const CommandHandlers = [
  CreateOrderHandler,
  UpdateOrderStatusHandler,
  DeleteOrderHandler,
];
const QueryHandlers = [GetAllOrdersHandler, GetOrderByIdHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Order, OrderItem, Product, Articul]),
  ],
  controllers: [OrdersController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class OrdersModule {}
