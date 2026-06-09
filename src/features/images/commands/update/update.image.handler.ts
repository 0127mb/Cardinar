import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { Image } from '../../../../shared/entities/image/image.entity';
import { UpdateImagePositionCommand } from './update-image.command';

@CommandHandler(UpdateImagePositionCommand)
export class UpdateImagePositionHandler implements ICommandHandler<UpdateImagePositionCommand> {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async execute(command: UpdateImagePositionCommand): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: { id: command.id },
    });
    if (!image) throw new NotFoundException('Image not found');

    image.position = command.position;
    return this.imageRepository.save(image);
  }
}
