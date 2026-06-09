import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Part } from '../../../../shared/entities/part/part.entity'; 
import { GetAllPartsQuery } from './get-all-parts.query';

@QueryHandler(GetAllPartsQuery)
export class GetAllPartsHandler implements IQueryHandler<GetAllPartsQuery> {
  constructor(
    @InjectRepository(Part)
    private readonly repository: Repository<Part>,
  ) {}

  async execute(): Promise<Part[]> {
    return await this.repository.find({
      relations: ['material', 'color'],
    });
  }
}
