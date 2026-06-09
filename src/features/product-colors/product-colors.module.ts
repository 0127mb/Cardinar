import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductColor } from '../../shared/entities/product-color/product-color.entity';
import { ProductColorsController } from './controller/product-colors.controller';
import { CreateProductColorHandler } from './commands/create-product-color/create-product-color.handler';
import { DeleteProductColorHandler } from './commands/delete-product-color/delete-product-color.handler';
import { GetAllProductColorsHandler } from './queries/get-all-product-colors/get-all-product-colors.handler';
import { GetProductColorByIdHandler } from './queries/get-product-color-by-id/get-product-color-by-id.handler';

const CommandHandlers = [CreateProductColorHandler, DeleteProductColorHandler];
const QueryHandlers = [GetAllProductColorsHandler, GetProductColorByIdHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ProductColor])],
  controllers: [ProductColorsController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class ProductColorsModule {}
