import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { GetBranchByIdQuery } from './get-branches-by-query';
import { Branch } from '../../../../shared/entities/branch/branch.entity'; 

@QueryHandler(GetBranchByIdQuery)
export class GetBranchByIdHandler implements IQueryHandler<GetBranchByIdQuery> {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async execute(query: GetBranchByIdQuery): Promise<Branch> {
    const branch = await this.branchRepository.findOne({
      where: { id: query.id },
    });
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }
}
