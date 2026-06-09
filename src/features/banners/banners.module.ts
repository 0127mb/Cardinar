import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from '../../shared/entities/banner/banner.entity';
import { ProductsTranslation } from '../../shared/entities/translation/translation.entity';
import { BannersController } from './controller/banners.controller';
import { CreateBannerHandler } from './commands/create-banner/create-banner.handler';
import { UpdateBannerHandler } from './commands/update-banner/update-banner.handler';
import { DeleteBannerHandler } from './commands/delete-banner/delete-banner.handler';
import { GetAllBannersHandler } from './queries/get-all-banners/get-all-banners.handler';
import { GetBannerByIdHandler } from './queries/get-banner-by-id/get-banner-by-id.handler';

const CommandHandlers = [
  CreateBannerHandler,
  UpdateBannerHandler,
  DeleteBannerHandler,
];
const QueryHandlers = [GetAllBannersHandler, GetBannerByIdHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Banner, ProductsTranslation])],
  controllers: [BannersController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class BannersModule {}
