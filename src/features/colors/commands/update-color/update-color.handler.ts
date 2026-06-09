import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateColorCommand } from './update-color.command';
import { Color } from '../../../../shared/entities/color/color.entity'; 

@CommandHandler(UpdateColorCommand)
export class UpdateColorHandler implements ICommandHandler<UpdateColorCommand> {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  async execute(command: UpdateColorCommand): Promise<Color> {
    const color = await this.colorRepository.findOne({
      where: { id: command.id },
    });
    if (!color) throw new NotFoundException('Color not found');

    Object.assign(color, command.dto);
    return this.colorRepository.save(color);
  }
}
