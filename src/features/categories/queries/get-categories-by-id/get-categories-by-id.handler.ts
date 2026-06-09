import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { GetCategoryByIdQuery } from './get-categories-by-id.query';
import { Category } from '../../../../shared/entities/category/category.entity';

@QueryHandler(GetCategoryByIdQuery)
export class GetCategoryByIdHandler implements IQueryHandler<GetCategoryByIdQuery> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(query: GetCategoryByIdQuery): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: query.id },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
}
