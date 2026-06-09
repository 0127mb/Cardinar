import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { OrderItem } from '../../../../shared/entities/order-item/order-item.entity';
import { CreateOrderItemCommand } from './create-order-item.command';

@CommandHandler(CreateOrderItemCommand)
export class CreateOrderItemHandler implements ICommandHandler<CreateOrderItemCommand> {
  constructor(
    @InjectRepository(OrderItem)
    private readonly repository: Repository<OrderItem>,
  ) {}

  async execute(command: CreateOrderItemCommand): Promise<OrderItem> {
    try {
      const orderItem = this.repository.create({
        orderId: command.orderId,
        productId: command.productId,
        articulId: command.articulId,
        quantity: command.quantity,
      });

      return await this.repository.save(orderItem);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create order item');
    }
  }
}
