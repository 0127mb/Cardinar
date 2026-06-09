import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CustomModel } from '../../../../shared/entities/custom-model/custom-model.entity';
import { GetCustomModelByIdQuery } from './get-custom-model-by-id.query';

@QueryHandler(GetCustomModelByIdQuery)
export class GetCustomModelByIdHandler implements IQueryHandler<GetCustomModelByIdQuery> {
  constructor(
    @InjectRepository(CustomModel)
    private readonly repository: Repository<CustomModel>,
  ) {}

  async execute(query: GetCustomModelByIdQuery): Promise<CustomModel> {
    const model = await this.repository.findOne({ where: { id: query.id } });

    if (!model) {
      throw new NotFoundException('Custom model not found');
    }

    return model;
  }
}
