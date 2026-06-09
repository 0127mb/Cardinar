import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Part } from '../../shared/entities/part/part.entity'; 
import { PartsController } from './controller/parts.controller';
import { CreatePartHandler } from './commands/create-part/create-part.handler';
import { UpdatePartHandler } from './commands/update-part/update-part.handler';
import { DeletePartHandler } from './commands/delete-part/delete-part.handler';
import { GetAllPartsHandler } from './queries/get-all-parts/get-all-parts.handler';
import { GetPartByIdHandler } from './queries/get-part-by-id/get-part-by-id.handler';

const CommandHandlers = [
  CreatePartHandler,
  UpdatePartHandler,
  DeletePartHandler,
];
const QueryHandlers = [GetAllPartsHandler, GetPartByIdHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Part])],
  controllers: [PartsController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class PartsModule {}
