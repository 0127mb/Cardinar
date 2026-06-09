import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductColor } from '../../../../shared/entities/product-color/product-color.entity'; 
import { DeleteProductColorCommand } from './delete-product-color.command';

@CommandHandler(DeleteProductColorCommand)
export class DeleteProductColorHandler implements ICommandHandler<DeleteProductColorCommand> {
  constructor(
    @InjectRepository(ProductColor)
    private readonly repository: Repository<ProductColor>,
  ) {}

  async execute(command: DeleteProductColorCommand): Promise<void> {
    try {
      const productColor = await this.repository.findOne({
        where: { id: command.id },
      });

      if (!productColor) {
        throw new NotFoundException('Product color not found');
      }

      await this.repository.remove(productColor);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete product color');
    }
  }
}
