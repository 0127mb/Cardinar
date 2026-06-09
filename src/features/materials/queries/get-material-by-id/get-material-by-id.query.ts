import { IQuery } from '@nestjs/cqrs';

export class GetMaterialByIdQuery implements IQuery {
  constructor(public readonly id: number) {}
}
