import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllCarMakesQuery } from './get-all.query';
import { CarMake } from '../../../../shared/entities/car.make/car.make.entity'; 

@QueryHandler(GetAllCarMakesQuery)
export class GetAllCarMakesHandler implements IQueryHandler<GetAllCarMakesQuery> {
  constructor(
    @InjectRepository(CarMake)
    private readonly carMakeRepository: Repository<CarMake>,
  ) {}

  async execute(): Promise<CarMake[]> {
    return this.carMakeRepository.find();
  }
}
