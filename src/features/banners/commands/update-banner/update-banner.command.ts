import { ICommand } from '@nestjs/cqrs';
import { BannerTranslationFields } from '../../dto/banner.dto';

export class UpdateBannerCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly image: string | undefined,
    public readonly isActive: boolean,
    public readonly translations?: BannerTranslationFields,
  ) {}
}
