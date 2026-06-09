import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CustomModel } from '../../../../shared/entities/custom-model/custom-model.entity';
import { DeleteCustomModelCommand } from './delete-custom-model.command';

@CommandHandler(DeleteCustomModelCommand)
export class DeleteCustomModelHandler implements ICommandHandler<DeleteCustomModelCommand> {
  constructor(
    @InjectRepository(CustomModel)
    private readonly repository: Repository<CustomModel>,
  ) {}

  async execute(command: DeleteCustomModelCommand): Promise<void> {
    try {
      const model = await this.repository.findOne({
        where: { id: command.id },
      });

      if (!model) {
        throw new NotFoundException('Custom model not found');
      }

      await this.repository.remove(model);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete custom model');
    }
  }
}
