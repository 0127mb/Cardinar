import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from '../../../../shared/entities/order-item/order-item.entity'; 
import { GetAllOrderItemsQuery } from './get-all-order-items.query';

@QueryHandler(GetAllOrderItemsQuery)
export class GetAllOrderItemsHandler implements IQueryHandler<GetAllOrderItemsQuery> {
  constructor(
    @InjectRepository(OrderItem)
    private readonly repository: Repository<OrderItem>,
  ) {}

  async execute(): Promise<OrderItem[]> {
    return await this.repository.find({
      relations: ['order', 'product', 'articul'],
    });
  }
}
