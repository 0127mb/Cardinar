import { ICommand } from '@nestjs/cqrs';

export class DeleteBannerCommand implements ICommand {
  constructor(public readonly id: number) {}
}
