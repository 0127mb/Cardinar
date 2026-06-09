import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductColor } from '../../../../shared/entities/product-color/product-color.entity'; 
import { GetAllProductColorsQuery } from './get-all-product-colors.query';

@QueryHandler(GetAllProductColorsQuery)
export class GetAllProductColorsHandler implements IQueryHandler<GetAllProductColorsQuery> {
  constructor(
    @InjectRepository(ProductColor)
    private readonly repository: Repository<ProductColor>,
  ) {}

  async execute(): Promise<ProductColor[]> {
    return await this.repository.find({
      relations: ['product', 'color'],
    });
  }
}
