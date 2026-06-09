import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Material } from '../../../../shared/entities/material/material.entity';
import { GetAllMaterialsQuery } from './get-all-materials.query';

@QueryHandler(GetAllMaterialsQuery)
export class GetAllMaterialsHandler implements IQueryHandler<GetAllMaterialsQuery> {
  constructor(
    @InjectRepository(Material)
    private readonly repository: Repository<Material>,
  ) {}

  async execute(): Promise<Material[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch materials');
    }
  }
}
