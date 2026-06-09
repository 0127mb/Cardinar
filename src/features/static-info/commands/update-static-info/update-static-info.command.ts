import { TranslationStaticInfoDto } from '../../dto/translation-static-info.dto';

export class UpdateStaticInfoCommand {
  constructor(
    readonly address: string,
    readonly phoneNumber: string,
    readonly workingHours: string,
    readonly email: string,
    readonly translations?: TranslationStaticInfoDto[],
  ) {}
}
