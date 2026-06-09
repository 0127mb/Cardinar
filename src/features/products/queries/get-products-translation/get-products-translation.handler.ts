import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Language,
  ProductsTranslation,
} from '../../../../shared/entities/translation/translation.entity';
import { GetProductsTranslationQuery } from './get-products-translation.query';

@QueryHandler(GetProductsTranslationQuery)
export class GetProductsTranslationHandler
  implements IQueryHandler<GetProductsTranslationQuery>
{
  constructor(
    @InjectRepository(ProductsTranslation)
    private readonly repository: Repository<ProductsTranslation>,
  ) {}

  async execute(query: GetProductsTranslationQuery) {
    if (!['title', 'description'].includes(query.field)) {
      throw new BadRequestException('Field must be title or description');
    }
    if (!Object.values(Language).includes(query.lang)) {
      throw new BadRequestException('Language must be uz or ru');
    }

    return this.repository
      .createQueryBuilder('translation')
      .select([
        'translation.id',
        'translation.lang',
        'translation.type',
        `translation.${query.field}`,
        'translation.productId',
        'translation.categoryId',
        'translation.materialId',
        'translation.branchId',
        'translation.carMakeId',
        'translation.carModelId',
        'translation.colorId',
        'translation.partId',
        'translation.bannerId',
        'translation.socialLinkId',
        'translation.customModelId',
      ])
      .where('translation.type = :type', { type: query.type })
      .andWhere('translation.lang = :lang', { lang: query.lang })
      .andWhere(`translation.${query.field} IS NOT NULL`)
      .getMany();
  }
}
