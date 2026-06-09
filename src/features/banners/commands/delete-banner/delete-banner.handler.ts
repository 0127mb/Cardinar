import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Banner } from '../../../../shared/entities/banner/banner.entity'
import { DeleteBannerCommand } from './delete-banner.command';

@CommandHandler(DeleteBannerCommand)
export class DeleteBannerHandler implements ICommandHandler<DeleteBannerCommand> {
  constructor(
    @InjectRepository(Banner) private readonly repository: Repository<Banner>,
  ) {}
  async execute(command: DeleteBannerCommand): Promise<void> {
    try {
      const banner = await this.repository.findOne({
        where: { id: command.id },
      });
      if (!banner) throw new NotFoundException('Banner not found');
      await this.repository.remove(banner);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete banner');
    }
  }
}
