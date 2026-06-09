import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllCarModelsQuery } from './get-all.query';
import { CarModel } from '../../../../shared/entities/car-model/car-model.entity'; 

@QueryHandler(GetAllCarModelsQuery)
export class GetAllCarModelsHandler implements IQueryHandler<GetAllCarModelsQuery> {
  constructor(
    @InjectRepository(CarModel)
    private readonly carModelRepository: Repository<CarModel>,
  ) {}

  async execute(query: GetAllCarModelsQuery): Promise<CarModel[]> {
    if (query.carMakeId) {
      return this.carModelRepository.find({
        where: { carMakeId: query.carMakeId },
      });
    }
    return this.carModelRepository.find();
  }
}
