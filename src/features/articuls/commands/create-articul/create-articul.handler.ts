import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Articul } from '../../../../shared/entities/articul/articul.entity'; 
import { CreateArticulCommand } from './create-articul.command';

@CommandHandler(CreateArticulCommand)
export class CreateArticulHandler implements ICommandHandler<CreateArticulCommand> {
  constructor(
    @InjectRepository(Articul)
    private readonly repository: Repository<Articul>,
  ) {}

  async execute(command: CreateArticulCommand): Promise<Articul> {
    try {
      const existingArticul = await this.repository.findOne({
        where: { productId: command.productId, carModelId: command.carModelId },
      });

      if (existingArticul) {
        throw new BadRequestException('Articul already exists');
      }

      const articul = this.repository.create({
        productId: command.productId,
        carModelId: command.carModelId,
      });

      return await this.repository.save(articul);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to create articul');
    }
  }
}
