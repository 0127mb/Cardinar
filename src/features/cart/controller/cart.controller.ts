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
import { AddToCartDTO } from '../dto/add-to-cart.dto';
import { UpdateCartItemDTO } from '../dto/update-cart-item.dto';
import { AddToCartCommand } from '../commands/add-to-cart/add-to-cart.command';
import { RemoveFromCartCommand } from '../commands/remove-from-cart/remove-from-cart.command';
import { UpdateCartItemCommand } from '../commands/update-cart-item/update-cart-item.command';
import { ClearCartCommand } from '../commands/clear-cart/clear-cart.command';
import { GetCartQuery } from '../queries/get-cart/get-cart.query';

@Controller('cart')
export class CartController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async addToCart(@Body() dto: AddToCartDTO) {
    return await this.commandBus.execute(
      new AddToCartCommand(dto.productId, dto.articulId, dto.quantity || 1),
    );
  }

  @Get()
  async getCart() {
    return await this.queryBus.execute(new GetCartQuery());
  }

  @Put(':id')
  async updateCartItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartItemDTO,
  ) {
    return await this.commandBus.execute(
      new UpdateCartItemCommand(id, dto.quantity),
    );
  }

  @Delete(':id')
  async removeFromCart(@Param('id', ParseIntPipe) id: number) {
    return await this.commandBus.execute(new RemoveFromCartCommand(id));
  }

  @Delete()
  async clearCart() {
    return await this.commandBus.execute(new ClearCartCommand());
  }
}
