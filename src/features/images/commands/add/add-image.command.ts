import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { Image } from '../../../../shared/entities/image/image.entity';
import { Product } from '../../../../shared/entities/product/product.entity';
import { AddImageCommand } from './add-image.handeler';

@CommandHandler(AddImageCommand)
export class AddImageHandler implements ICommandHandler<AddImageCommand> {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async execute(command: AddImageCommand): Promise<Image> {
    const { productId, imageUrl, position } = command;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    // Auto calculate position if not provided
    let imagePosition = position;
    if (imagePosition === undefined) {
      const count = await this.imageRepository.count({
        where: { productId },
      });
      imagePosition = count + 1;
    }

    const image = this.imageRepository.create({
      productId,
      image: imageUrl,
      position: imagePosition,
    });

    return this.imageRepository.save(image);
  }
}
