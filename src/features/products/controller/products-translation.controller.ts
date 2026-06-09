import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  Language,
  ProductsTranslation,
} from '../../../shared/entities/translation/translation.entity';
import { CreateProductTranslationDto } from '../dto/product-translation.dto';
import { GetProductsTranslationQuery } from '../queries/get-products-translation/get-products-translation.query';

const languageSwaggerEnum = ['uz', 'ru'];

@ApiTags('Products Translation')
@Controller()
export class ProductsTranslationController {
  constructor(
    private readonly queryBus: QueryBus,
    @InjectRepository(ProductsTranslation)
    private readonly repository: Repository<ProductsTranslation>,
  ) {}

  @Post('productsTranslation')
  @ApiOperation({
    summary:
      'Create Uzbek/Russian translation for products, banners, categories, branches, parts and other translated tables',
  })
  createProductsTranslation(@Body() dto: CreateProductTranslationDto) {
    return this.repository.save(this.repository.create(dto));
  }

  @Get(':tableName/:field/productsTranslation')
  @ApiOperation({
    summary:
      'Get translations by table name and field. Example: /api/products/title/productsTranslation?lang=uz',
  })
  @ApiQuery({ name: 'lang', enum: languageSwaggerEnum })
  getProductsTranslation(
    @Param('tableName') tableName: string,
    @Param('field') field: 'title' | 'description',
    @Query('lang') lang: string,
  ) {
    return this.queryBus.execute(
      new GetProductsTranslationQuery(tableName, field, lang as Language),
    );
  }
}
