import { ICommand } from '@nestjs/cqrs';

export class UpdateProfileImageCommand implements ICommand {
  constructor(
    public readonly userId: number,
    public readonly profileImage: string,
  ) {}
}
