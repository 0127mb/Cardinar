import { ICommand } from '@nestjs/cqrs';

export class CreateMaterialCommand implements ICommand {
  constructor(
    public readonly title: string,
    public readonly description?: string,
  ) {}
}
