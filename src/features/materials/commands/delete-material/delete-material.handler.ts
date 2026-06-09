import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Material } from '../../../../shared/entities/material/material.entity'; 
import { DeleteMaterialCommand } from './delete-material.command';

@CommandHandler(DeleteMaterialCommand)
export class DeleteMaterialHandler implements ICommandHandler<DeleteMaterialCommand> {
  constructor(
    @InjectRepository(Material)
    private readonly repository: Repository<Material>,
  ) {}

  async execute(command: DeleteMaterialCommand): Promise<void> {
    try {
      const material = await this.repository.findOne({
        where: { id: command.id },
      });

      if (!material) {
        throw new NotFoundException('Material not found');
      }

      await this.repository.remove(material);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete material');
    }
  }
}
