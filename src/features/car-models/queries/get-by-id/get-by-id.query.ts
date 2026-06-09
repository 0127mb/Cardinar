import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CarModel } from '../../../../shared/entities/car-model/car-model.entity'; 
import { GetCarModelByIdQuery } from './get-by-id.handler';

@QueryHandler(GetCarModelByIdQuery)
export class GetCarModelByIdHandler implements IQueryHandler<GetCarModelByIdQuery> {
  constructor(
    @InjectRepository(CarModel)
    private readonly carModelRepository: Repository<CarModel>,
  ) {}

  async execute(query: GetCarModelByIdQuery): Promise<CarModel> {
    const carModel = await this.carModelRepository.findOne({
      where: { id: query.id },
    });
    if (!carModel) throw new NotFoundException('Car model not found');
    return carModel;
  }
}
