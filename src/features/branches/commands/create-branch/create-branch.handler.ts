import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { CreateBranchCommand } from './create-branch.command';
import { Branch, BranchType } from '../../../../shared/entities/branch/branch.entity';

@CommandHandler(CreateBranchCommand)
export class CreateBranchHandler implements ICommandHandler<CreateBranchCommand> {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async execute(command: CreateBranchCommand): Promise<Branch> {
    const existing= await this.branchRepository.findOne({
      where: { title: command.title },
    });

    if (existing)  throw new ConflictException('Branch with this title already exists');
    const branch = this.branchRepository.create({
      title:   command.title as Branch["title"], 
      address: command.address,
      phoneNumber: command.phoneNumber,
      longitude: command.longitude,
      latitude: command.latitude,
      branchType: command.branchType as unknown as BranchType,
      district: command.district,
      region: command.region,
      isActive: command.isActive ?? true,
    } );
    return this.branchRepository.save(branch);
  }
}
