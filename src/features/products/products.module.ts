import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateProductHandler } from './command/create/products.handler';
import { UpdateProductHandler } from './command/update/products.handler';
import { DeleteProductHandler } from './command/delete/products.handler';
import { GetAllProductsHandler } from './queries/get-all/get-all.handler';
import { GetProductByIdHandler } from './queries/get-by-id/get-by-id.handler';
import { GetProductsTranslationHandler } from './queries/get-products-translation/get-products-translation.handler';
import { ProductsController } from './controller/product.controller';
import { ProductsTranslationController } from './controller/products-translation.controller';
import { Product } from '../../shared/entities/product/product.entity';
import { Category } from '../../shared/entities/category/category.entity';
import { Color } from '../../shared/entities/color/color.entity';
import { CarModel } from '../../shared/entities/car-model/car-model.entity';
import { ProductColor } from '../../shared/entities/product-color/product-color.entity';
import { Articul } from '../../shared/entities/articul/articul.entity';
import { Image } from '../../shared/entities/image/image.entity';
import { ProductsTranslation } from '../../shared/entities/translation/translation.entity';

const CommandHandlers = [
  CreateProductHandler,
  UpdateProductHandler,
  DeleteProductHandler,
];

const QueryHandlers = [
  GetAllProductsHandler,
  GetProductByIdHandler,
  GetProductsTranslationHandler,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      Product,
      Category,
      Color,
      CarModel,
      ProductColor,
      Articul,
      Image,
      ProductsTranslation,
    ]),
  ],
  controllers: [ProductsController, ProductsTranslationController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
