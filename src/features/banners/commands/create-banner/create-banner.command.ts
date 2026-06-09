import { ICommand } from '@nestjs/cqrs';
import { BannerTranslationFields } from '../../dto/banner.dto';

export class CreateBannerCommand implements ICommand {
  constructor(
    public readonly title: string,
    public readonly image: string,
    public readonly isActive: boolean = true,
    public readonly translations?: BannerTranslationFields,
  ) {}
}
