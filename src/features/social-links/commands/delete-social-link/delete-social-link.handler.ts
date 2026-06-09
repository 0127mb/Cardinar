import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SocialLink } from '../../../../shared/entities/soical-link/soical-link.entity'; 
import { DeleteSocialLinkCommand } from './delete-social-link.command';

@CommandHandler(DeleteSocialLinkCommand)
export class DeleteSocialLinkHandler implements ICommandHandler<DeleteSocialLinkCommand> {
  constructor(
    @InjectRepository(SocialLink) private readonly repo: Repository<SocialLink>,
  ) {}
  async execute(cmd: DeleteSocialLinkCommand): Promise<void> {
    try {
      const link = await this.repo.findOne({ where: { id: cmd.id } });
      if (!link) throw new NotFoundException('Social link not found');
      await this.repo.remove(link);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete social link');
    }
  }
}
