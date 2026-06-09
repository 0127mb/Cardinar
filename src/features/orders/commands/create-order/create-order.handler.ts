import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Order } from '../../../../shared/entities/order/order.entity';
import { OrderItem } from '../../../../shared/entities/order-item/order-item.entity'; 
import { Product } from '../../../../shared/entities/product/product.entity';
import { Articul } from '../../../../shared/entities/articul/articul.entity';
import { CreateOrderCommand } from './create-order.command';
import { orderStatus } from '../../../../shared/enums/orderStatus.enum';


@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Articul)
    private readonly articulRepository: Repository<Articul>,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: CreateOrderCommand): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of command.items) {
        const product = await this.productRepository.findOne({
          where: { id: item.productId },
        });
        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found`,
          );
        }

        const articul = await this.articulRepository.findOne({
          where: { id: item.articulId },
        });
        if (!articul) {
          throw new NotFoundException(
            `Articul with ID ${item.articulId} not found`,
          );
        }
      }

      const order = this.orderRepository.create({
        user: { id: command.userId },
        branch: { id: command.branchId },

        fullName: command.fullName,
        phoneNumber: command.phoneNumber,

        email: command.email ?? undefined,

        delivery: command.delivery,
        paymentMethod: command.paymentMethod,
        status: orderStatus.processing,
      });

      const savedOrder = await queryRunner.manager.save(order);

      // Create order items
      const orderItems = command.items.map((item) =>
        this.orderItemRepository.create({
          orderId: savedOrder.id,
          productId: item.productId,
          articulId: item.articulId,
          quantity: item.quantity,
        }),
      );

      await queryRunner.manager.save(orderItems);
      await queryRunner.commitTransaction();

      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to create order');
    } finally {
      await queryRunner.release();
    }
  }
}
