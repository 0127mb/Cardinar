import { ICommand } from '@nestjs/cqrs';
export class UpdateSocialLinkCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly link: string,
    public readonly icon: string | undefined,
  ) {}
}
