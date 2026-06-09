import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Articul } from '../../../../shared/entities/articul/articul.entity'; 
import { UpdateArticulCommand } from './update-articul.command';

@CommandHandler(UpdateArticulCommand)
export class UpdateArticulHandler implements ICommandHandler<UpdateArticulCommand> {
  constructor(
    @InjectRepository(Articul)
    private readonly repository: Repository<Articul>,
  ) {}

  async execute(command: UpdateArticulCommand): Promise<Articul> {
    try {
      const articul = await this.repository.findOne({
        where: { id: command.id },
      });

      if (!articul) {
        throw new NotFoundException('Articul not found');
      }

      Object.assign(articul, {
        ...(command.productId !== undefined && {
          productId: command.productId,
        }),
        ...(command.carModelId !== undefined && {
          carModelId: command.carModelId,
        }),
      });

      return await this.repository.save(articul);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update articul');
    }
  }
}
