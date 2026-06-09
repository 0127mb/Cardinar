import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateProductCommand } from './products.command';
import { Product } from '../../../../shared/entities/product/product.entity';
import { Category } from '../../../../shared/entities/category/category.entity';
import { Color } from '../../../../shared/entities/color/color.entity';
import { CarModel } from '../../../../shared/entities/car-model/car-model.entity'; 
import { ProductColor } from '../../../../shared/entities/product-color/product-color.entity';
import { Articul } from '../../../../shared/entities/articul/articul.entity'; 

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
    @InjectRepository(CarModel)
    private readonly carModelRepository: Repository<CarModel>,
    @InjectRepository(ProductColor)
    private readonly productColorRepository: Repository<ProductColor>,
    @InjectRepository(Articul)
    private readonly articulRepository: Repository<Articul>,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const { dto } = command;

    // Check category
    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');

    // Check duplicate title
    const existing = await this.productRepository.findOne({
      where: { title: dto.title },
    });
    if (existing)
      throw new ConflictException('Product with this title already exists');

    // Create product
    const product = this.productRepository.create({
      categoryId: dto.categoryId,
      title: dto.title,
      price: dto.price,
      description: dto.description,
      status: dto.status,
      isPremium: dto.isPremium ?? false,
    });
    const savedProduct = await this.productRepository.save(product);

    // Create product colors
    if (dto.colorIds?.length) {
      for (const colorId of dto.colorIds) {
        const color = await this.colorRepository.findOne({
          where: { id: colorId },
        });
        if (!color)
          throw new NotFoundException(`Color with id ${colorId} not found`);

        const productColor = this.productColorRepository.create({
          productId: savedProduct.id,
          colorId,
        });
        await this.productColorRepository.save(productColor);
      }
    }

    // Create articuls (product + carModel combinations)
    if (dto.carModelIds?.length) {
      for (const carModelId of dto.carModelIds) {
        const carModel = await this.carModelRepository.findOne({
          where: { id: carModelId },
        });
        if (!carModel)
          throw new NotFoundException(
            `Car model with id ${carModelId} not found`,
          );

        const articul = this.articulRepository.create({
          productId: savedProduct.id,
          carModelId,
        });
        await this.articulRepository.save(articul);
      }
    }
    //@ts-ignore
    return this.productRepository.findOne({
      where: { id: savedProduct.id },
    });
  }
}
