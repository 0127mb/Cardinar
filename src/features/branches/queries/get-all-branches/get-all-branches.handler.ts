import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllBranchesQuery } from './get-all-baranches.command';
import { Branch } from '../../../../shared/entities/branch/branch.entity'; 

@QueryHandler(GetAllBranchesQuery)
export class GetAllBranchesHandler implements IQueryHandler<GetAllBranchesQuery> {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async execute(query: GetAllBranchesQuery): Promise<Branch[]> {
    if (query.onlyActive) {
      return this.branchRepository.find({ where: { isActive: true } });
    }
    return this.branchRepository.find();
  }
}
