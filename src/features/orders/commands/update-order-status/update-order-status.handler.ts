import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Order } from '../../../../shared/entities/order/order.entity'; 
import { UpdateOrderStatusCommand } from './update-order-status.command';

@CommandHandler(UpdateOrderStatusCommand)
export class UpdateOrderStatusHandler implements ICommandHandler<UpdateOrderStatusCommand> {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
  ) {}

  async execute(command: UpdateOrderStatusCommand): Promise<Order> {
    try {
      const order = await this.repository.findOne({
        where: { id: command.id },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      order.status = command.status;
      return await this.repository.save(order);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update order status');
    }
  }
}
