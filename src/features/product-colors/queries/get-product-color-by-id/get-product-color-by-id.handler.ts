import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductColor } from '../../../../shared/entities/product-color/product-color.entity'; 
import { GetProductColorByIdQuery } from './get-product-color-by-id.query';

@QueryHandler(GetProductColorByIdQuery)
export class GetProductColorByIdHandler implements IQueryHandler<GetProductColorByIdQuery> {
  constructor(
    @InjectRepository(ProductColor)
    private readonly repository: Repository<ProductColor>,
  ) {}

  async execute(query: GetProductColorByIdQuery): Promise<ProductColor> {
    const productColor = await this.repository.findOne({
      where: { id: query.id },
      relations: ['product', 'color'],
    });

    if (!productColor) {
      throw new NotFoundException('Product color not found');
    }

    return productColor;
  }
}
