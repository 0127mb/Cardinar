import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { CartItem } from '../../../../shared/entities/cart-item/cart-item.entity'; 
import { AddToCartCommand } from './add-to-cart.command';

@CommandHandler(AddToCartCommand)
export class AddToCartHandler implements ICommandHandler<AddToCartCommand> {
  constructor(
    @InjectRepository(CartItem)
    private readonly repository: Repository<CartItem>,
  ) {}

  async execute(command: AddToCartCommand): Promise<CartItem> {
    try {
      let cartItem = await this.repository.findOne({
        where: { productId: command.productId, articulId: command.articulId },
      });

      if (cartItem) {
        cartItem.quantity += command.quantity;
      } else {
        cartItem = this.repository.create({
          productId: command.productId,
          articulId: command.articulId,
          quantity: command.quantity,
        });
      }

      return await this.repository.save(cartItem);
    } catch (error) {
      throw new InternalServerErrorException('Failed to add to cart');
    }
  }
}
