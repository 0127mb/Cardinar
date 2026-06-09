import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Part } from '../../../../shared/entities/part/part.entity';
import { CreatePartCommand } from './create-part.command';

@CommandHandler(CreatePartCommand)
export class CreatePartHandler implements ICommandHandler<CreatePartCommand> {
  constructor(
    @InjectRepository(Part)
    private readonly repository: Repository<Part>,
  ) {}

  async execute(command: CreatePartCommand) {
    try {
      const part = this.repository.create({
        category: command.category,
        part: command.part,
        title: command.title ?? undefined,
        materialId: command.materialId,
        colorId: command.colorId,
        image: command.image,
      });

      return await this.repository.save(part);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create part');
    }
  }
}
