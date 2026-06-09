import { Language } from '../../../../shared/entities/translation/translation.entity';

export class GetTranslationStaticInfoQuery {
  constructor(public readonly lang: Language) {}
}
