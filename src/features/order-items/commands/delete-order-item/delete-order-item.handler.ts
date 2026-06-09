import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { OrderItem } from '../../../../shared/entities/order-item/order-item.entity';
import { DeleteOrderItemCommand } from './delete-order-item.command';

@CommandHandler(DeleteOrderItemCommand)
export class DeleteOrderItemHandler implements ICommandHandler<DeleteOrderItemCommand> {
  constructor(
    @InjectRepository(OrderItem)
    private readonly repository: Repository<OrderItem>,
  ) {}

  async execute(command: DeleteOrderItemCommand): Promise<void> {
    try {
      const orderItem = await this.repository.findOne({
        where: { id: command.id },
      });

      if (!orderItem) {
        throw new NotFoundException('Order item not found');
      }

      await this.repository.remove(orderItem);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete order item');
    }
  }
}
