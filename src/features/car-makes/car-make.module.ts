import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UpdateCarMakeHandler } from './commands/update-car-make/update-car-make.handler';
import { DeleteCarMakeHandler } from './commands/delete-car-make/delete-car-make.handler';
import { CreateCarMakeHandler } from './commands/create-car/create-car.handler';
import { GetAllCarMakesHandler } from './queries/get-all/get-all.handler';
import { GetCarMakeByIdHandler } from './queries/get-by-id/get-by-id.handler';
import { CarMake } from '../../shared/entities/car.make/car.make.entity';
import { CarMakesController } from './controller/car-make.controller';

const CommandHandlers = [
  CreateCarMakeHandler,
  UpdateCarMakeHandler,
  DeleteCarMakeHandler,
];
const QueryHandlers = [GetAllCarMakesHandler, GetCarMakeByIdHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([CarMake])],
  controllers: [CarMakesController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class CarMakesModule {}
