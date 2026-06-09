import { IQuery } from '@nestjs/cqrs';

export class GetBannerByIdQuery implements IQuery {
  constructor(public readonly id: number) {}
}
