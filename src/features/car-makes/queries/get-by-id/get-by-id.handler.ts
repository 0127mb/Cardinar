import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { GetCarMakeByIdQuery } from './get-by-id.query';
import { CarMake } from '../../../../shared/entities/car.make/car.make.entity'; 

@QueryHandler(GetCarMakeByIdQuery)
export class GetCarMakeByIdHandler implements IQueryHandler<GetCarMakeByIdQuery> {
  constructor(
    @InjectRepository(CarMake)
    private readonly carMakeRepository: Repository<CarMake>,
  ) {}

  async execute(query: GetCarMakeByIdQuery): Promise<CarMake> {
    const carMake = await this.carMakeRepository.findOne({
      where: { id: query.id },
    });
    if (!carMake) throw new NotFoundException('Car make not found');
    return carMake;
  }
}
