import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { CreateColorCommand } from './create-color.command';
import { Color } from '../../../../shared/entities/color/color.entity'; 

@CommandHandler(CreateColorCommand)
export class CreateColorHandler implements ICommandHandler<CreateColorCommand> {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  async execute(command: CreateColorCommand): Promise<Color> {
    const existing = await this.colorRepository.findOne({
      where: [{ title: command.title }, { color: command.color }],
    });
    if (existing) throw new ConflictException('Color already exists');

    const color = this.colorRepository.create({
      title: command.title,
      color: command.color,
    });
    return this.colorRepository.save(color);
  }
}
