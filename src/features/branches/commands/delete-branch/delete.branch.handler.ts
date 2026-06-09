import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeleteBranchCommand } from './delete-branch.command';
import { Branch } from '../../../../shared/entities/branch/branch.entity'; 

@CommandHandler(DeleteBranchCommand)
export class DeleteBranchHandler implements ICommandHandler<DeleteBranchCommand> {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async execute(command: DeleteBranchCommand): Promise<{ message: string }> {
    const branch = await this.branchRepository.findOne({
      where: { id: command.id },
    });
    if (!branch) throw new NotFoundException('Branch not found');

    await this.branchRepository.remove(branch);
    return { message: 'Branch deleted successfully' };
  }
}
