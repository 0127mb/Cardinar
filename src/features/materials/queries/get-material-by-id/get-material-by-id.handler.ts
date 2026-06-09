import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Material } from '../../../../shared/entities/material/material.entity'; 
import { GetMaterialByIdQuery } from './get-material-by-id.query';

@QueryHandler(GetMaterialByIdQuery)
export class GetMaterialByIdHandler implements IQueryHandler<GetMaterialByIdQuery> {
  constructor(
    @InjectRepository(Material)
    private readonly repository: Repository<Material>,
  ) {}

  async execute(query: GetMaterialByIdQuery): Promise<Material> {
    try {
      const material = await this.repository.findOne({
        where: { id: query.id },
      });

      if (!material) {
        throw new NotFoundException('Material not found');
      }

      return material;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch material');
    }
  }
}
