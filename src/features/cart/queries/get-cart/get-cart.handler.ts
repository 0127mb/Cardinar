import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from '../../../../shared/entities/cart-item/cart-item.entity';
import { GetCartQuery } from './get-cart.query';

@QueryHandler(GetCartQuery)
export class GetCartHandler implements IQueryHandler<GetCartQuery> {
  constructor(
    @InjectRepository(CartItem)
    private readonly repository: Repository<CartItem>,
  ) {}

  async execute(): Promise<CartItem[]> {
    return await this.repository.find({
      relations: ['product', 'articul'],
    });
  }
}
