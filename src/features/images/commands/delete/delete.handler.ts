import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeleteImageCommand } from './delete-image.command';
import { Image } from '../../../../shared/entities/image/image.entity'; 
import { unlink } from 'fs/promises';
import { join } from 'path';

@CommandHandler(DeleteImageCommand)
export class DeleteImageHandler implements ICommandHandler<DeleteImageCommand> {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async execute(command: DeleteImageCommand): Promise<{ message: string }> {
    const image = await this.imageRepository.findOne({
      where: { id: command.id },
    });
    if (!image) throw new NotFoundException('Image not found');

    // Delete file from disk
    try {
      const filePath = join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        image.image,
      );
      await unlink(filePath);
    } catch {
      // File might not exist on disk, continue anyway
    }

    await this.imageRepository.remove(image);
    return { message: 'Image deleted successfully' };
  }
}
