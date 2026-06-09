import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateBranchCommand } from './update.branch.command';
import { Branch } from '../../../../shared/entities/branch/branch.entity'; 

@CommandHandler(UpdateBranchCommand)
export class UpdateBranchHandler implements ICommandHandler<UpdateBranchCommand> {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async execute(command: UpdateBranchCommand): Promise<Branch> {
    const branch = await this.branchRepository.findOne({
      where: { id: command.id },
    });
    if (!branch) throw new NotFoundException('Branch not found');

    Object.assign(branch, command.dto);
    return this.branchRepository.save(branch);
  }
}
