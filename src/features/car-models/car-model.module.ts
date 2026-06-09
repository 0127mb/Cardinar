import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModel } from '../../shared/entities/car-model/car-model.entity'; 

import { UpdateCarModelHandler } from './commands/update-car-model/update-car-model.handler';
import { DeleteCarModelHandler } from './commands/delete-car-model/delete-car-model.handler';
import { CreateCarModelHandler } from './commands/ create-car-model/create-car-model.handler';
import { GetAllCarModelsHandler } from './queries/get-all/get-all.handler';
import { GetCarModelByIdHandler } from './queries/get-by-id/get-by-id.query';
import { CarMake } from '../../shared/entities/car.make/car.make.entity'; 
import { CarModelsController } from './controller/car-models.controller';

const CommandHandlers = [
  CreateCarModelHandler,
  UpdateCarModelHandler,
  DeleteCarModelHandler,
];
const QueryHandlers = [GetAllCarModelsHandler, GetCarModelByIdHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([CarModel, CarMake])],
  controllers: [CarModelsController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class CarModelsModule {}
