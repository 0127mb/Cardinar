import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CartItem } from '../../../../shared/entities/cart-item/cart-item.entity'; 
import { RemoveFromCartCommand } from './remove-from-cart.command';

@CommandHandler(RemoveFromCartCommand)
export class RemoveFromCartHandler implements ICommandHandler<RemoveFromCartCommand> {
  constructor(
    @InjectRepository(CartItem)
    private readonly repository: Repository<CartItem>,
  ) {}

  async execute(command: RemoveFromCartCommand): Promise<void> {
    try {
      const cartItem = await this.repository.findOne({
        where: { id: command.id },
      });

      if (!cartItem) {
        throw new NotFoundException('Cart item not found');
      }

      await this.repository.remove(cartItem);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to remove from cart');
    }
  }
}
