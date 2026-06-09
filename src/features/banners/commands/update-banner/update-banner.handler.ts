import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Banner } from '../../../../shared/entities/banner/banner.entity'; 
import { UpdateBannerCommand } from './update-banner.command';
import {
  Language,
  ProductsTranslation,
} from '../../../../shared/entities/translation/translation.entity';

@CommandHandler(UpdateBannerCommand)
export class UpdateBannerHandler implements ICommandHandler<UpdateBannerCommand> {
  constructor(
    @InjectRepository(Banner) private readonly repository: Repository<Banner>,
    @InjectRepository(ProductsTranslation)
    private readonly translationRepository: Repository<ProductsTranslation>,
  ) {}
  async execute(command: UpdateBannerCommand): Promise<Banner> {
    try {
      const banner = await this.repository.findOne({
        where: { id: command.id },
      });
      if (!banner) throw new NotFoundException('Banner not found');
      banner.title = command.title;
      if (command.image !== undefined) {
        banner.image = command.image;
      }
      banner.isActive = command.isActive;
      const savedBanner = await this.repository.save(banner);
      await this.saveTranslations(savedBanner.id, command);
      return savedBanner;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update banner');
    }
  }

  private async saveTranslations(
    bannerId: number,
    command: UpdateBannerCommand,
  ) {
    const translations = [
      {
        lang: Language.RU,
        title: command.translations?.titleRu,
        description: command.translations?.descriptionRu,
      },
      {
        lang: Language.UZ,
        title: command.translations?.titleUz,
        description: command.translations?.descriptionUz,
      },
    ].filter((translation) => translation.title || translation.description);

    for (const translation of translations) {
      const existing = await this.translationRepository.findOne({
        where: {
          lang: translation.lang,
          type: 'banners',
          bannerId,
        },
      });

      if (existing) {
        existing.title = translation.title;
        existing.description = translation.description;
        await this.translationRepository.save(existing);
      } else {
        await this.translationRepository.save(
          this.translationRepository.create({
            lang: translation.lang,
            type: 'banners',
            bannerId,
            title: translation.title,
            description: translation.description,
          }),
        );
      }
    }
  }
}
