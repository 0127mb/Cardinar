import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Banner } from '../../../../shared/entities/banner/banner.entity';
import { CreateBannerCommand } from './create-banner.command';
import {
  Language,
  ProductsTranslation,
} from '../../../../shared/entities/translation/translation.entity';

@CommandHandler(CreateBannerCommand)
export class CreateBannerHandler implements ICommandHandler<CreateBannerCommand> {
  constructor(
    @InjectRepository(Banner) private readonly repository: Repository<Banner>,
    @InjectRepository(ProductsTranslation)
    private readonly translationRepository: Repository<ProductsTranslation>,
  ) {}
  async execute(command: CreateBannerCommand): Promise<Banner> {
    try {
      const banner = this.repository.create({
        title: command.title,
        image: command.image,
        isActive: command.isActive,
      });
      const savedBanner = await this.repository.save(banner);
      await this.saveTranslations(savedBanner.id, command);
      return savedBanner;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create banner');
    }
  }

  private async saveTranslations(
    bannerId: number,
    command: CreateBannerCommand,
  ) {
    const rows = [
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
    ]
      .filter((translation) => translation.title || translation.description)
      .map((translation) =>
        this.translationRepository.create({
          lang: translation.lang,
          type: 'banners',
          bannerId,
          title: translation.title,
          description: translation.description,
        }),
      );

    if (rows.length) {
      await this.translationRepository.save(rows);
    }
  }
}
