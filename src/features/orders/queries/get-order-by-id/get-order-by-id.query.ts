import { IQuery } from '@nestjs/cqrs';

export class GetOrderByIdQuery implements IQuery {
  constructor(public readonly id: number) {}
}
