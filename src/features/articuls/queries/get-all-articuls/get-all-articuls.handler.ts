import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Articul } from '../../../../shared/entities/articul/articul.entity';
import { GetAllArticulsQuery } from './get-all-articuls.query';

@QueryHandler(GetAllArticulsQuery)
export class GetAllArticulsHandler implements IQueryHandler<GetAllArticulsQuery> {
  constructor(
    @InjectRepository(Articul)
    private readonly repository: Repository<Articul>,
  ) {}

  async execute(): Promise<Articul[]> {
    return await this.repository.find({
      relations: ['product', 'carModel'],
    });
  }
}
