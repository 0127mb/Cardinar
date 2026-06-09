import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from '../../shared/entities/order-item/order-item.entity'; 
import { OrderItemsController } from './controller/order-items.controller';
import { CreateOrderItemHandler } from './commands/create-order-item/create-order-item.handler';
import { UpdateOrderItemHandler } from './commands/update-order-item/update-order-item.handler';
import { DeleteOrderItemHandler } from './commands/delete-order-item/delete-order-item.handler';
import { GetAllOrderItemsHandler } from './queries/get-all-order-items/get-all-order-items.handler';
import { GetOrderItemByIdHandler } from './queries/get-order-item-by-id/get-order-item-by-id.handler';

const CommandHandlers = [
  CreateOrderItemHandler,
  UpdateOrderItemHandler,
  DeleteOrderItemHandler,
];
const QueryHandlers = [GetAllOrderItemsHandler, GetOrderItemByIdHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([OrderItem])],
  controllers: [OrderItemsController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class OrderItemsModule {}
