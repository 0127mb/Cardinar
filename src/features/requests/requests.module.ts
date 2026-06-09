import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from '../../shared/entities/request/request.entity'; 
import { RequestsController } from './controller/requests.controller';
import { CreateRequestHandler } from './commands/create-request/create-request.handler';
import { DeleteRequestHandler } from './commands/delete-request/delete-request.handler';
import { GetAllRequestsHandler } from './queries/get-all-requests/get-all-requests.handler';
import { GetRequestByIdHandler } from './queries/get-request-by-id/get-request-by-id.handler';

const CommandHandlers = [CreateRequestHandler, DeleteRequestHandler];
const QueryHandlers = [GetAllRequestsHandler, GetRequestByIdHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Request])],
  controllers: [RequestsController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class RequestsModule {}
