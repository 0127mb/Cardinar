import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductColor } from '../../../../shared/entities/product-color/product-color.entity';
import { CreateProductColorCommand } from './create-product-color.command';

@CommandHandler(CreateProductColorCommand)
export class CreateProductColorHandler implements ICommandHandler<CreateProductColorCommand> {
  constructor(
    @InjectRepository(ProductColor)
    private readonly repository: Repository<ProductColor>,
  ) {}

  async execute(command: CreateProductColorCommand): Promise<ProductColor> {
    try {
      const existing = await this.repository.findOne({
        where: { productId: command.productId, colorId: command.colorId },
      });

      if (existing) {
        throw new BadRequestException('Product color already exists');
      }

      const productColor = this.repository.create({
        productId: command.productId,
        colorId: command.colorId,
      });

      return await this.repository.save(productColor);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to create product color');
    }
  }
}
