import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Order } from '../../../../shared/entities/order/order.entity';
import { OrderItem } from '../../../../shared/entities/order-item/order-item.entity'; 
import { DeleteOrderCommand } from './delete-order.command';

@CommandHandler(DeleteOrderCommand)
export class DeleteOrderHandler implements ICommandHandler<DeleteOrderCommand> {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async execute(command: DeleteOrderCommand): Promise<void> {
    try {
      const order = await this.repository.findOne({
        where: { id: command.id },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      await this.orderItemRepository.delete({ orderId: command.id });
      await this.repository.remove(order);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete order');
    }
  }
}
