import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { Image } from '../../shared/entities/image/image.entity';
import { Product } from '../../shared/entities/product/product.entity'; 

import { multerConfig } from '../../shared/common/config/multer.config';
import { AddImageHandler } from './commands/add/add-image.command';
import { DeleteImageHandler } from './commands/delete/delete.handler';
import { UpdateImagePositionHandler } from './commands/update/update.image.handler';
import { GetProductImagesHandler } from './queries/get/get-product-image.handler';
import { ImagesController } from './controller/image.controller';

const CommandHandlers = [
  AddImageHandler,
  DeleteImageHandler,
  UpdateImagePositionHandler,
];

const QueryHandlers = [GetProductImagesHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Image, Product]),
    MulterModule.register(multerConfig),
  ],
  controllers: [ImagesController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class ImagesModule {}
