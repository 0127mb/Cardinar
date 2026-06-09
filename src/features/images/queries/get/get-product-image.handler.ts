import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetProductImagesQuery } from './get-product-images.query';
import { Image } from '../../../../shared/entities/image/image.entity'; 

@QueryHandler(GetProductImagesQuery)
export class GetProductImagesHandler implements IQueryHandler<GetProductImagesQuery> {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async execute(query: GetProductImagesQuery): Promise<Image[]> {
    return this.imageRepository.find({
      where: { productId: query.productId },
      order: { position: 'ASC' },
    });
  }
}
