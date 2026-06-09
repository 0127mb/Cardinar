import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomModel } from '../../shared/entities/custom-model/custom-model.entity'; 
import { CustomModelsController } from './controller/custom-models.controller';
import { CreateCustomModelHandler } from './commands/create-custom-model/create-custom-model.handler';
import { UpdateCustomModelHandler } from './commands/update-custom-model/update-custom-model.handler';
import { DeleteCustomModelHandler } from './commands/delete-custom-model/delete-custom-model.handler';
import { GetAllCustomModelsHandler } from './queries/get-all-custom-models/get-all-custom-models.handler';
import { GetCustomModelByIdHandler } from './queries/get-custom-model-by-id/get-custom-model-by-id.handler';

const CommandHandlers = [
  CreateCustomModelHandler,
  UpdateCustomModelHandler,
  DeleteCustomModelHandler,
];
const QueryHandlers = [GetAllCustomModelsHandler, GetCustomModelByIdHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([CustomModel])],
  controllers: [CustomModelsController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class CustomModelsModule {}
