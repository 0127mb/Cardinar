import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeleteProductCommand } from './products.command';
import { Product } from '../../../../shared/entities/product/product.entity'; 
import { ProductColor } from '../../../../shared/entities/product-color/product-color.entity'; 
import { Articul } from '../../../../shared/entities/articul/articul.entity'; 
import { Image } from '../../../../shared/entities/image/image.entity';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductColor)
    private readonly productColorRepository: Repository<ProductColor>,
    @InjectRepository(Articul)
    private readonly articulRepository: Repository<Articul>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async execute(command: DeleteProductCommand): Promise<{ message: string }> {
    const product = await this.productRepository.findOne({
      where: { id: command.id },
    });
    if (!product) throw new NotFoundException('Product not found');

    // Delete related records first
    await this.imageRepository.delete({ productId: command.id });
    await this.productColorRepository.delete({ productId: command.id });
    await this.articulRepository.delete({ productId: command.id });
    await this.productRepository.remove(product);

    return { message: 'Product deleted successfully' };
  }
}
