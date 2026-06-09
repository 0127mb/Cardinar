import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Part as PartEntity } from '../../../../shared/entities/part/part.entity';
import { UpdatePartCommand } from './update-part.command';

@CommandHandler(UpdatePartCommand)
export class UpdatePartHandler implements ICommandHandler<UpdatePartCommand> {
  constructor(
    @InjectRepository(PartEntity)
    private readonly repository: Repository<PartEntity>,
  ) {}

  async execute(command: UpdatePartCommand): Promise<PartEntity> {
    try {
      const part = await this.repository.findOne({ where: { id: command.id } });

      if (!part) {
        throw new NotFoundException('Part not found');
      }

      Object.assign(part, {
        ...(command.category !== undefined && { category: command.category }),
        ...(command.part !== undefined && { part: command.part }),
        ...(command.title !== undefined && { title: command.title }),
        ...(command.materialId !== undefined && {
          materialId: command.materialId,
        }),
        ...(command.colorId !== undefined && { colorId: command.colorId }),
        ...(command.image !== undefined && { image: command.image }),
      });

      return await this.repository.save(part);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update part');
    }
  }
}
