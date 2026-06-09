import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { OrderItem } from '../../../../shared/entities/order-item/order-item.entity';
import { GetOrderItemByIdQuery } from './get-order-item-by-id.query';

@QueryHandler(GetOrderItemByIdQuery)
export class GetOrderItemByIdHandler implements IQueryHandler<GetOrderItemByIdQuery> {
  constructor(
    @InjectRepository(OrderItem)
    private readonly repository: Repository<OrderItem>,
  ) {}

  async execute(query: GetOrderItemByIdQuery): Promise<OrderItem> {
    const orderItem = await this.repository.findOne({
      where: { id: query.id },
      relations: ['order', 'product', 'articul'],
    });

    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }

    return orderItem;
  }
}
