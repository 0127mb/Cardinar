import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CartItem } from '../../../../shared/entities/cart-item/cart-item.entity'; 
import { UpdateCartItemCommand } from './update-cart-item.command';

@CommandHandler(UpdateCartItemCommand)
export class UpdateCartItemHandler implements ICommandHandler<UpdateCartItemCommand> {
  constructor(
    @InjectRepository(CartItem)
    private readonly repository: Repository<CartItem>,
  ) {}

  async execute(command: UpdateCartItemCommand): Promise<CartItem> {
    try {
      const cartItem = await this.repository.findOne({
        where: { id: command.id },
      });

      if (!cartItem) {
        throw new NotFoundException('Cart item not found');
      }

      cartItem.quantity = command.quantity;
      return await this.repository.save(cartItem);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update cart item');
    }
  }
}
