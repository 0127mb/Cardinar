import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Articul } from '../../../../shared/entities/articul/articul.entity'; 
import { DeleteArticulCommand } from './delete-articul.command';

@CommandHandler(DeleteArticulCommand)
export class DeleteArticulHandler implements ICommandHandler<DeleteArticulCommand> {
  constructor(
    @InjectRepository(Articul)
    private readonly repository: Repository<Articul>,
  ) {}

  async execute(command: DeleteArticulCommand): Promise<void> {
    try {
      const articul = await this.repository.findOne({
        where: { id: command.id },
      });

      if (!articul) {
        throw new NotFoundException('Articul not found');
      }

      await this.repository.remove(articul);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete articul');
    }
  }
}
