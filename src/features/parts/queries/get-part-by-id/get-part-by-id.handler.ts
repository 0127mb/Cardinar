import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Part } from '../../../../shared/entities/part/part.entity';
import { GetPartByIdQuery } from './get-part-by-id.query';

@QueryHandler(GetPartByIdQuery)
export class GetPartByIdHandler implements IQueryHandler<GetPartByIdQuery> {
  constructor(
    @InjectRepository(Part)
    private readonly repository: Repository<Part>,
  ) {}

  async execute(query: GetPartByIdQuery): Promise<Part> {
    const part = await this.repository.findOne({
      where: { id: query.id },
      relations: ['material', 'color'],
    });

    if (!part) {
      throw new NotFoundException('Part not found');
    }

    return part;
  }
}
