import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Request as RequestEntity } from '../../../../shared/entities/request/request.entity';
import { GetRequestByIdQuery } from './get-request-by-id.query';

@QueryHandler(GetRequestByIdQuery)
export class GetRequestByIdHandler implements IQueryHandler<GetRequestByIdQuery> {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly repository: Repository<RequestEntity>,
  ) {}

  async execute(query: GetRequestByIdQuery): Promise<RequestEntity> {
    const request = await this.repository.findOne({
      where: { id: query.id },
      relations: ['user'],
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return request;
  }
}
