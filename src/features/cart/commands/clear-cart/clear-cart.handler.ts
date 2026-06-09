import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { CartItem } from '../../../../shared/entities/cart-item/cart-item.entity'; 
import { ClearCartCommand } from './clear-cart.command';

@CommandHandler(ClearCartCommand)
export class ClearCartHandler implements ICommandHandler<ClearCartCommand> {
  constructor(
    @InjectRepository(CartItem)
    private readonly repository: Repository<CartItem>,
  ) {}

  async execute(): Promise<void> {
    try {
      await this.repository.delete({});
    } catch (error) {
      throw new InternalServerErrorException('Failed to clear cart');
    }
  }
}
