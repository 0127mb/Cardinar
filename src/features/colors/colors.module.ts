import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Color } from '../../shared/entities/color/color.entity';

import { CreateColorHandler } from './commands/create-color/create-color.handler';
import { UpdateColorHandler } from './commands/update-color/update-color.handler';

import { GetAllColorsHandler } from './queries/get-all-colors/get-all-colors.handler';
import { GetColorByIdHandler } from './queries/get-color-by-id/get-color-by-id.handler';
import { DeleteColorHandler } from './commands/delete-color/delete-color.handler'; 
import { ColorsController } from './controller/colors.controller';

const CommandHandlers = [
  CreateColorHandler,
  UpdateColorHandler,
  DeleteColorHandler,
];
const QueryHandlers = [GetAllColorsHandler, GetColorByIdHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Color])],
  controllers: [ColorsController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class ColorsModule {}
