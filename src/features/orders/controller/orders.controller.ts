import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateOrderDto, UpdateOrderStatusDto } from '../dto/order.dto';
import { CreateOrderCommand } from '../commands/create-order/create-order.command';
import { UpdateOrderStatusCommand } from '../commands/update-order-status/update-order-status.command';
import { DeleteOrderCommand } from '../commands/delete-order/delete-order.command';
import { GetAllOrdersQuery } from '../queries/get-all-orders/get-all-orders.query';
import { GetOrderByIdQuery } from '../queries/get-order-by-id/get-order-by-id.query';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { Order } from '../../../shared/entities/order/order.entity';
import { AdminGuard } from '../../../shared/guards/admin.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new order' })
  async create(
    @CurrentUser() user: any,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.commandBus.execute(
      new CreateOrderCommand(
        user.id,
        createOrderDto.branchId,
        createOrderDto.fullName,
        createOrderDto.phoneNumber,
        //@ts-ignore
        createOrderDto.email,
        createOrderDto.delivery,
        createOrderDto.paymentMethod,
        createOrderDto.items,
      ),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders (admin only)' })
  async findAll(): Promise<Order[]> {
    return this.queryBus.execute(new GetAllOrdersQuery());
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by ID' })
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.queryBus.execute(new GetOrderByIdQuery(+id));
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.commandBus.execute(
      new UpdateOrderStatusCommand(+id, updateOrderStatusDto.status),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete order' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteOrderCommand(+id));
  }
}
