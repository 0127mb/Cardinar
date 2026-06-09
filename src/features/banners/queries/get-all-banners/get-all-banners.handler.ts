import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Banner } from '../../../../shared/entities/banner/banner.entity'; 
import { GetAllBannersQuery } from './get-all-banners.query';

@QueryHandler(GetAllBannersQuery)
export class GetAllBannersHandler implements IQueryHandler<GetAllBannersQuery> {
  constructor(
    @InjectRepository(Banner) private readonly repository: Repository<Banner>,
  ) {}
  async execute(): Promise<Banner[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch banners');
    }
  }
}
