import { ICommand } from '@nestjs/cqrs';

export class DeleteMaterialCommand implements ICommand {
  constructor(public readonly id: number) {}
}
