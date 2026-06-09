import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CustomModel } from '../../../../shared/entities/custom-model/custom-model.entity';
import { UpdateCustomModelCommand } from './update-custom-model.command';

@CommandHandler(UpdateCustomModelCommand)
export class UpdateCustomModelHandler implements ICommandHandler<UpdateCustomModelCommand> {
  constructor(
    @InjectRepository(CustomModel)
    private readonly repository: Repository<CustomModel>,
  ) {}

  async execute(command: UpdateCustomModelCommand): Promise<CustomModel> {
    try {
      const model = await this.repository.findOne({
        where: { id: command.id },
      });

      if (!model) {
        throw new NotFoundException('Custom model not found');
      }

      Object.assign(model, {
        ...(command.title !== undefined && { title: command.title }),
        ...(command.image !== undefined && { image: command.image }),
      });

      return await this.repository.save(model);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update custom model');
    }
  }
}
