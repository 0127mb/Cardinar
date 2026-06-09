import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CustomModel } from '../../../../shared/entities/custom-model/custom-model.entity'; 
import { CreateCustomModelCommand } from './create-custom-model.command';

@CommandHandler(CreateCustomModelCommand)
export class CreateCustomModelHandler implements ICommandHandler<CreateCustomModelCommand> {
  constructor(
    @InjectRepository(CustomModel)
    private readonly repository: Repository<CustomModel>,
  ) {}

  async execute(command: CreateCustomModelCommand): Promise<CustomModel> {
    try {
      const existingModel = await this.repository.findOne({
        where: { title: command.title },
      });

      if (existingModel) {
        throw new BadRequestException('Custom model already exists');
      }

      const model = this.repository.create({
        category: command.category,
        title: command.title,
        image: command.image,
      });
      const save = await this.repository.save(model);
      return save;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to create custom model');
    }
  }
}
