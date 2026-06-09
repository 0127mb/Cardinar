import { ICommand } from '@nestjs/cqrs';
export class CreateSocialLinkCommand implements ICommand {
  constructor(
    public readonly title: string,
    public readonly link: string,
    public readonly icon: string,
  ) {}
}
