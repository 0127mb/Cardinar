import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomModel } from '../../../../shared/entities/custom-model/custom-model.entity'; 
import { GetAllCustomModelsQuery } from './get-all-custom-models.query';

@QueryHandler(GetAllCustomModelsQuery)
export class GetAllCustomModelsHandler implements IQueryHandler<GetAllCustomModelsQuery> {
  constructor(
    @InjectRepository(CustomModel)
    private readonly repository: Repository<CustomModel>,
  ) {}

  async execute(): Promise<CustomModel[]> {
    return await this.repository.find();
  }
}
