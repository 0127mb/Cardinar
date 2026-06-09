import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductFilterDto } from '../dto/product.filters';
import { GetAllProductsQuery } from '../queries/get-all/get-all.query';
import { GetProductByIdQuery } from '../queries/get-by-id/get-by-id.query';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { CreateProductDto, UpdateProductDto } from '../dto/products.dto';
import { CreateProductCommand } from '../command/create/products.command';
import { UpdateProductCommand } from '../command/update/products.command';
import { DeleteProductCommand } from '../command/delete/products.command';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with optional filters' })
  findAll(@Query() filter: ProductFilterDto) {
    return this.queryBus.execute(new GetAllProductsQuery(filter));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id with full details' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new GetProductByIdQuery(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create product (admin only)' })
  create(@Body() dto: CreateProductDto) {
    return this.commandBus.execute(new CreateProductCommand(dto));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (admin only)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.commandBus.execute(new UpdateProductCommand(id, dto));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (admin only)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteProductCommand(id));
  }
}
