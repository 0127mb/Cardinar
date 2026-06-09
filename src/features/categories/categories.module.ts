import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../shared/entities/category/category.entity';
import { CreateCategoryHandler } from './commands/create-category/create-category.handler';
import { UpdateCategoryHandler } from './commands/update-category/update-category.handler';
import { DeleteCategoryHandler } from './commands/delete-category/delete-category.handler';
import { GetAllCategoriesHandler } from './queries/get-all-categories/get-all-categories.handler';
import { GetCategoryByIdHandler } from './queries/get-categories-by-id/get-categories-by-id.handler';
import { CategoriesController } from './controller/categories.controller';

const CommandHandlers = [
  CreateCategoryHandler,
  UpdateCategoryHandler,
  DeleteCategoryHandler,
];
const QueryHandlers = [GetAllCategoriesHandler, GetCategoryByIdHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class CategoriesModule {}
