import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SocialLink } from '../../../../shared/entities/soical-link/soical-link.entity'; 
import { CreateSocialLinkCommand } from './create-social-link.command';

@CommandHandler(CreateSocialLinkCommand)
export class CreateSocialLinkHandler implements ICommandHandler<CreateSocialLinkCommand> {
  constructor(
    @InjectRepository(SocialLink) private readonly repo: Repository<SocialLink>,
  ) {}
  async execute(cmd: CreateSocialLinkCommand): Promise<SocialLink> {
    try {
      const existing = await this.repo.findOne({ where: { link: cmd.link } });
      if (existing) throw new BadRequestException('Social link already exists');
      const link = this.repo.create({
        title: cmd.title,
        link: cmd.link,
        icon: cmd.icon,
      });
      return await this.repo.save(link);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to create social link');
    }
  }
}
