import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articul } from '../../shared/entities/articul/articul.entity'; 
import { ArticulsController } from './controller/articuls.controller';
import { CreateArticulHandler } from './commands/create-articul/create-articul.handler';
import { UpdateArticulHandler } from './commands/update-articul/update-articul.handler';
import { DeleteArticulHandler } from './commands/delete-articul/delete-articul.handler';
import { GetAllArticulsHandler } from './queries/get-all-articuls/get-all-articuls.handler';
import { GetArticulByIdHandler } from './queries/get-articul-by-id/get-articul-by-id.handler';

const CommandHandlers = [
  CreateArticulHandler,
  UpdateArticulHandler,
  DeleteArticulHandler,
];
const QueryHandlers = [GetAllArticulsHandler, GetArticulByIdHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Articul])],
  controllers: [ArticulsController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class ArticulsModule {}
