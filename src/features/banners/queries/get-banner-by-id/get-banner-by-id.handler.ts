import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Banner } from '../../../../shared/entities/banner/banner.entity'; 
import { GetBannerByIdQuery } from './get-banner-by-id.query';

@QueryHandler(GetBannerByIdQuery)
export class GetBannerByIdHandler implements IQueryHandler<GetBannerByIdQuery> {
  constructor(
    @InjectRepository(Banner) private readonly repository: Repository<Banner>,
  ) {}
  async execute(query: GetBannerByIdQuery): Promise<Banner> {
    try {
      const banner = await this.repository.findOne({ where: { id: query.id } });
      if (!banner) throw new NotFoundException('Banner not found');
      return banner;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch banner');
    }
  }
}
