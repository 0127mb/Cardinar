import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Color } from '../../../../shared/entities/color/color.entity'; 
import { DeleteColorCommand } from './delete-color.command';

@CommandHandler(DeleteColorCommand)
export class DeleteColorHandler implements ICommandHandler<DeleteColorCommand> {
  constructor(
    @InjectRepository(Color)
    private readonly repository: Repository<Color>,
  ) {}

  async execute(command: DeleteColorCommand): Promise<Color> {
    try {
      const color = await this.repository.findOne({
        where: { id: command.id },
      });

      if (!color) {
        throw new NotFoundException('Color not found');
      }

      await this.repository.remove(color);
      return color;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete color');
    }
  }
}
