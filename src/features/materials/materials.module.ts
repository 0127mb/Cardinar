import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from '../../shared/entities/material/material.entity'; 
import { MaterialsController } from './controller/materials.controller';
import { CreateMaterialHandler } from './commands/create-material/create-material.handler';
import { UpdateMaterialHandler } from './commands/update-material/update-material.handler';
import { DeleteMaterialHandler } from './commands/delete-material/delete-material.handler';
import { GetAllMaterialsHandler } from './queries/get-all-materials/get-all-materials.handler';
import { GetMaterialByIdHandler } from './queries/get-material-by-id/get-material-by-id.handler';

const CommandHandlers = [
  CreateMaterialHandler,
  UpdateMaterialHandler,
  DeleteMaterialHandler,
];
const QueryHandlers = [GetAllMaterialsHandler, GetMaterialByIdHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Material])],
  controllers: [MaterialsController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class MaterialsModule {}
