import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderItemDTO } from '../dto/create-order-item.dto';
import { UpdateOrderItemDTO } from '../dto/update-order-item.dto';
import { CreateOrderItemCommand } from '../commands/create-order-item/create-order-item.command';
import { UpdateOrderItemCommand } from '../commands/update-order-item/update-order-item.command';
import { DeleteOrderItemCommand } from '../commands/delete-order-item/delete-order-item.command';
import { GetAllOrderItemsQuery } from '../queries/get-all-order-items/get-all-order-items.query';
import { GetOrderItemByIdQuery } from '../queries/get-order-item-by-id/get-order-item-by-id.query';

@Controller('order-items')
export class OrderItemsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateOrderItemDTO) {
    return await this.commandBus.execute(
      new CreateOrderItemCommand(
        dto.orderId,
        dto.productId,
        dto.articulId,
        dto.quantity,
      ),
    );
  }

  @Get()
  async getAll() {
    return await this.queryBus.execute(new GetAllOrderItemsQuery());
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.queryBus.execute(new GetOrderItemByIdQuery(id));
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderItemDTO) {
    return await this.commandBus.execute(
      new UpdateOrderItemCommand(id, dto.quantity),
    );
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.commandBus.execute(new DeleteOrderItemCommand(id));
  }
}
