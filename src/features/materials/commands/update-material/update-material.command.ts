import { ICommand } from '@nestjs/cqrs';

export class UpdateMaterialCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description?: string,
  ) {}
}
