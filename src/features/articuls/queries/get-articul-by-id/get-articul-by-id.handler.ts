import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Articul } from '../../../../shared/entities/articul/articul.entity';
import { GetArticulByIdQuery } from './get-articul-by-id.query';

@QueryHandler(GetArticulByIdQuery)
export class GetArticulByIdHandler implements IQueryHandler<GetArticulByIdQuery> {
  constructor(
    @InjectRepository(Articul)
    private readonly repository: Repository<Articul>,
  ) {}

  async execute(query: GetArticulByIdQuery): Promise<Articul> {
    const articul = await this.repository.findOne({
      where: { id: query.id },
      relations: ['product', 'carModel'],
    });

    if (!articul) {
      throw new NotFoundException('Articul not found');
    }

    return articul;
  }
}
