import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllProductsQuery } from './get-all.query';
import { Product } from '../../../../shared/entities/product/product.entity';

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsHandler implements IQueryHandler<GetAllProductsQuery> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async execute(query: GetAllProductsQuery): Promise<Product[]> {
    const { filter } = query;

    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.productColors', 'productColors')
      .leftJoinAndSelect('productColors.color', 'color')
      .leftJoinAndSelect('product.articuls', 'articuls')
      .leftJoinAndSelect('articuls.carModel', 'carModel')
      .leftJoinAndSelect('carModel.carMake', 'carMake');

    if (filter.categoryId) {
      qb.andWhere('product.categoryId = :categoryId', {
        categoryId: filter.categoryId,
      });
    }

    if (filter.status) {
      qb.andWhere('product.status = :status', { status: filter.status });
    }

    if (filter.isPremium !== undefined) {
      qb.andWhere('product.isPremium = :isPremium', {
        isPremium: filter.isPremium,
      });
    }

    if (filter.minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice: filter.minPrice });
    }

    if (filter.maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: filter.maxPrice });
    }

    if (filter.carModelId) {
      qb.andWhere('articuls.carModelId = :carModelId', {
        carModelId: filter.carModelId,
      });
    }

    return qb.getMany();
  }
}
