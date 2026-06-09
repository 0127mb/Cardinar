import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Part } from '../../../../shared/entities/part/part.entity';
import { DeletePartCommand } from './delete-part.command';

@CommandHandler(DeletePartCommand)
export class DeletePartHandler implements ICommandHandler<DeletePartCommand> {
  constructor(
    @InjectRepository(Part)
    private readonly repository: Repository<Part>,
  ) {}

  async execute(command: DeletePartCommand): Promise<Part> {
    try {
      const part = await this.repository.findOne({ where: { id: command.id } });

      if (!part) {
        throw new NotFoundException('Part not found');
      }

      await this.repository.remove(part);
      return part;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete part');
    }
  }
}
