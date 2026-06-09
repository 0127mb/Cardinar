import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SocialLink } from '../../../../shared/entities/soical-link/soical-link.entity'; 
import { UpdateSocialLinkCommand } from './update-social-link.command';

@CommandHandler(UpdateSocialLinkCommand)
export class UpdateSocialLinkHandler implements ICommandHandler<UpdateSocialLinkCommand> {
  constructor(
    @InjectRepository(SocialLink) private readonly repo: Repository<SocialLink>,
  ) {}
  async execute(cmd: UpdateSocialLinkCommand): Promise<SocialLink> {
    try {
      const link = await this.repo.findOne({ where: { id: cmd.id } });
      if (!link) throw new NotFoundException('Social link not found');
      link.title = cmd.title;
      link.link = cmd.link;
      if (cmd.icon !== undefined) {
        link.icon = cmd.icon;
      }
      return await this.repo.save(link);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update social link');
    }
  }
}
