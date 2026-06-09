import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Order } from '../../../../shared/entities/order/order.entity'; 
import { GetAllOrdersQuery } from './get-all-orders.query';

@QueryHandler(GetAllOrdersQuery)
export class GetAllOrdersHandler implements IQueryHandler<GetAllOrdersQuery> {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
  ) {}

  async execute(): Promise<Order[]> {
    try {
      return await this.repository.find({
        relations: ['user', 'branch'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch orders');
    }
  }
}
