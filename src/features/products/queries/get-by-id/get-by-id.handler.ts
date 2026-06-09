import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { Product } from '../../../../shared/entities/product/product.entity'; 
import { GetProductByIdQuery } from './get-by-id.query';

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdHandler implements IQueryHandler<GetProductByIdQuery> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async execute(query: GetProductByIdQuery): Promise<Product> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.productColors', 'productColors')
      .leftJoinAndSelect('productColors.color', 'color')
      .leftJoinAndSelect('product.articuls', 'articuls')
      .leftJoinAndSelect('articuls.carModel', 'carModel')
      .leftJoinAndSelect('carModel.carMake', 'carMake')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.id = :id', { id: query.id })
      .getOne();

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
