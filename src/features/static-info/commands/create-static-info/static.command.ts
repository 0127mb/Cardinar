import { TranslationStaticInfoDto } from '../../dto/translation-static-info.dto';

export class CreateStaticInfoCommand {
    constructor(public readonly address: string,
        public readonly phoneNumber: string,
        public readonly workingHours: string,
        public readonly email: string,
        public readonly translations?: TranslationStaticInfoDto[]) {}
}
