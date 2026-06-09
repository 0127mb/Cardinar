import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialLink } from '../../shared/entities/soical-link/soical-link.entity';
import { SocialLinksController } from './controller/social-links.controller';
import { CreateSocialLinkHandler } from './commands/create-social-link/create-social-link.handler';
import { UpdateSocialLinkHandler } from './commands/update-social-link/update-social-link.handler';
import { DeleteSocialLinkHandler } from './commands/delete-social-link/delete-social-link.handler';
import { GetAllSocialLinksHandler } from './queries/get-all-social-links/get-all.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([SocialLink])],
  controllers: [SocialLinksController],
  providers: [
    CreateSocialLinkHandler,
    UpdateSocialLinkHandler,
    DeleteSocialLinkHandler,
    GetAllSocialLinksHandler,
  ],
  exports: [TypeOrmModule],
})
export class SocialLinksModule {}
