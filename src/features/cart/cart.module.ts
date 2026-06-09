import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from '../../shared/entities/cart-item/cart-item.entity'; 
import { CartController } from './controller/cart.controller';
import { AddToCartHandler } from './commands/add-to-cart/add-to-cart.handler';
import { RemoveFromCartHandler } from './commands/remove-from-cart/remove-from-cart.handler';
import { UpdateCartItemHandler } from './commands/update-cart-item/update-cart-item.handler';
import { ClearCartHandler } from './commands/clear-cart/clear-cart.handler';
import { GetCartHandler } from './queries/get-cart/get-cart.handler';

const CommandHandlers = [
  AddToCartHandler,
  RemoveFromCartHandler,
  UpdateCartItemHandler,
  ClearCartHandler,
];
const QueryHandlers = [GetCartHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([CartItem])],
  controllers: [CartController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class CartModule {}
