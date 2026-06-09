import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from '../../shared/entities/branch/branch.entity'; 
import { CreateBranchHandler } from './commands/create-branch/create-branch.handler';
import { UpdateBranchHandler } from './commands/update-branch/update.branch.handler';
import { DeleteBranchHandler } from './commands/delete-branch/delete.branch.handler';
import { GetAllBranchesHandler } from './queries/get-all-branches/get-all-branches.handler';
import { GetBranchByIdHandler } from './queries/get-branches-by-query/get-branches-by-id.handler';
import { BranchesController } from './controller/branches.controller';

const CommandHandlers = [
  CreateBranchHandler,
  UpdateBranchHandler,
  DeleteBranchHandler,
];

const QueryHandlers = [GetAllBranchesHandler, GetBranchByIdHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Branch])],
  controllers: [BranchesController],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class BranchesModule {}
