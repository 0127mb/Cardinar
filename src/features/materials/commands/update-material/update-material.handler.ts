import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Material } from '../../../../shared/entities/material/material.entity'; 
import { UpdateMaterialCommand } from './update-material.command';

@CommandHandler(UpdateMaterialCommand)
export class UpdateMaterialHandler implements ICommandHandler<UpdateMaterialCommand> {
  constructor(
    @InjectRepository(Material)
    private readonly repository: Repository<Material>,
  ) {}

  async execute(command: UpdateMaterialCommand): Promise<Material> {
    try {
      const material = await this.repository.findOne({
        where: { id: command.id },
      });

      if (!material) {
        throw new NotFoundException('Material not found');
      }

      const existingMaterial = await this.repository.findOne({
        where: { title: command.title },
      });

      if (existingMaterial && existingMaterial.id !== command.id) {
        throw new BadRequestException(
          'Material with this title already exists',
        );
      }

      material.title = command.title;
      //@ts-ignore
      material.description = command.description;

      return await this.repository.save(material);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw error;
      throw new InternalServerErrorException('Failed to update material');
    }
  }
}
