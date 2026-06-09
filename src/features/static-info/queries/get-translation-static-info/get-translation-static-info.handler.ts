import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TranslationStaticInfo } from '../../../../shared/entities/translation-static-info/translation-static-info.entity';
import { Language } from '../../../../shared/entities/translation/translation.entity';
import { GetTranslationStaticInfoQuery } from './get-translation-static-info.query';

@QueryHandler(GetTranslationStaticInfoQuery)
export class GetTranslationStaticInfoHandler
  implements IQueryHandler<GetTranslationStaticInfoQuery>
{
  constructor(
    @InjectRepository(TranslationStaticInfo)
    private readonly repository: Repository<TranslationStaticInfo>,
  ) {}

  async execute(query: GetTranslationStaticInfoQuery) {
    if (!Object.values(Language).includes(query.lang)) {
      throw new BadRequestException('Language must be uz or ru');
    }

    return this.repository.find({
      where: { lang: query.lang },
      relations: ['staticInfo'],
    });
  }
}
