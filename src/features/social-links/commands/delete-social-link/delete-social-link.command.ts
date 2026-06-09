import { ICommand } from '@nestjs/cqrs';
export class DeleteSocialLinkCommand implements ICommand {
  constructor(public readonly id: number) {}
}
