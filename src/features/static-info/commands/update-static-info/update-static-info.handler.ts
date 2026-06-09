import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { StaticInfo } from '../../../../shared/entities/static.info/static.info.entity';
import { UpdateStaticInfoCommand } from './update-static-info.command';
import { TranslationStaticInfo } from '../../../../shared/entities/translation-static-info/translation-static-info.entity';

@CommandHandler(UpdateStaticInfoCommand)
export class UpdateStaticInfoHandler implements ICommandHandler<UpdateStaticInfoCommand> {
  constructor(
    @InjectRepository(StaticInfo)
    private readonly repository: Repository<StaticInfo>,
    @InjectRepository(TranslationStaticInfo)
    private readonly translationRepository: Repository<TranslationStaticInfo>,
  ) {}

  async execute(command: UpdateStaticInfoCommand): Promise<StaticInfo> {
    try {
      let staticInfo = await this.repository.findOne({ where: { id: 1 } });

      if (!staticInfo) {
        staticInfo = this.repository.create({ id: 1 });
      }

      Object.assign(staticInfo, {
        address: command.address,
        phoneNumber: command.phoneNumber,
        workingHours: command.workingHours,
        email: command.email,
      });

      const savedStaticInfo = await this.repository.save(staticInfo);

      if (command.translations?.length) {
        for (const translation of command.translations) {
          const existing = translation.lang
            ? await this.translationRepository.findOne({
                where: {
                  staticInfoId: savedStaticInfo.id,
                  lang: translation.lang,
                },
              })
            : null;

          await this.translationRepository.save({
            ...(existing ?? {}),
            ...translation,
            staticInfoId: savedStaticInfo.id,
          });
        }
      }

      return savedStaticInfo;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update static info');
    }
  }
}
