import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductColorDTO } from '../dto/create-product-color.dto';
import { CreateProductColorCommand } from '../commands/create-product-color/create-product-color.command';
import { DeleteProductColorCommand } from '../commands/delete-product-color/delete-product-color.command';
import { GetAllProductColorsQuery } from '../queries/get-all-product-colors/get-all-product-colors.query';
import { GetProductColorByIdQuery } from '../queries/get-product-color-by-id/get-product-color-by-id.query';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { AdminGuard } from '../../../shared/guards/admin.guard';

@Controller('product-colors')
export class ProductColorsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() dto: CreateProductColorDTO) {
    return await this.commandBus.execute(
      new CreateProductColorCommand(dto.productId, dto.colorId),
    );
  }

  @Get()
  async getAll() {
    return await this.queryBus.execute(new GetAllProductColorsQuery());
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.queryBus.execute(new GetProductColorByIdQuery(id));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.commandBus.execute(new DeleteProductColorCommand(id));
  }
}
