import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Material } from '../../../../shared/entities/material/material.entity'; 
import { CreateMaterialCommand } from './create-material.command';

@CommandHandler(CreateMaterialCommand)
export class CreateMaterialHandler implements ICommandHandler<CreateMaterialCommand> {
  constructor(
    @InjectRepository(Material)
    private readonly repository: Repository<Material>,
  ) {}

  async execute(command: CreateMaterialCommand): Promise<Material> {
    try {
      const existingMaterial = await this.repository.findOne({
        where: { title: command.title },
      });

      if (existingMaterial) {
        throw new BadRequestException('Material already exists');
      }

      const material = this.repository.create({
        title: command.title,
        description: command.description,
      });

      return await this.repository.save(material);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to create material');
    }
  }
}
