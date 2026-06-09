import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { Product } from '../../../../shared/entities/product/product.entity'; 
import { ProductColor } from '../../../../shared/entities/product-color/product-color.entity';
import { Articul } from '../../../../shared/entities/articul/articul.entity';
import { Color } from '../../../../shared/entities/color/color.entity'; 
import { CarModel } from '../../../../shared/entities/car-model/car-model.entity';
import { UpdateProductCommand } from './products.command';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductColor)
    private readonly productColorRepository: Repository<ProductColor>,
    @InjectRepository(Articul)
    private readonly articulRepository: Repository<Articul>,
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
    @InjectRepository(CarModel)
    private readonly carModelRepository: Repository<CarModel>,
  ) {}

  async execute(command: UpdateProductCommand): Promise<Product> {
    const { id, dto } = command;

    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    // Update basic fields
    Object.assign(product, {
      ...(dto.title && { title: dto.title }),
      ...(dto.price && { price: dto.price }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.isPremium !== undefined && { isPremium: dto.isPremium }),
      ...(dto.categoryId && { categoryId: dto.categoryId }),
    });
    await this.productRepository.save(product);

    // Update colors — replace all
    if (dto.colorIds) {
      await this.productColorRepository.delete({ productId: id });
      for (const colorId of dto.colorIds) {
        const color = await this.colorRepository.findOne({
          where: { id: colorId },
        });
        if (!color)
          throw new NotFoundException(`Color with id ${colorId} not found`);
        await this.productColorRepository.save(
          this.productColorRepository.create({ productId: id, colorId }),
        );
      }
    }

    // Update articuls — replace all
    if (dto.carModelIds) {
      await this.articulRepository.delete({ productId: id });
      for (const carModelId of dto.carModelIds) {
        const carModel = await this.carModelRepository.findOne({
          where: { id: carModelId },
        });
        if (!carModel)
          throw new NotFoundException(
            `Car model with id ${carModelId} not found`,
          );
        await this.articulRepository.save(
          this.articulRepository.create({ productId: id, carModelId }),
        );
      }
    }
    const newProduct: any = this.productRepository.findOne({ where: { id } });
    return newProduct;
  }
}
