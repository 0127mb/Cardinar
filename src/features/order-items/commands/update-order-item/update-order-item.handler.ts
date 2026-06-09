import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { OrderItem } from '../../../../shared/entities/order-item/order-item.entity'; 
import { UpdateOrderItemCommand } from './update-order-item.command';

@CommandHandler(UpdateOrderItemCommand)
export class UpdateOrderItemHandler implements ICommandHandler<UpdateOrderItemCommand> {
  constructor(
    @InjectRepository(OrderItem)
    private readonly repository: Repository<OrderItem>,
  ) {}

  async execute(command: UpdateOrderItemCommand): Promise<OrderItem> {
    try {
      const orderItem = await this.repository.findOne({
        where: { id: command.id },
      });

      if (!orderItem) {
        throw new NotFoundException('Order item not found');
      }

      if (command.quantity !== undefined) {
        orderItem.quantity = command.quantity;
      }

      return await this.repository.save(orderItem);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update order item');
    }
  }
}
