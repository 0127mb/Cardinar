import { Language } from '../../../../shared/entities/translation/translation.entity';

export class GetProductsTranslationQuery {
  constructor(
    public readonly type: string,
    public readonly field: 'title' | 'description',
    public readonly lang: Language,
  ) {}
}
