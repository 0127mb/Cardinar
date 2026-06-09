import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Request as RequestEntity } from '../../../../shared/entities/request/request.entity';
import { GetAllRequestsQuery } from './get-all-requests.query';

@QueryHandler(GetAllRequestsQuery)
export class GetAllRequestsHandler implements IQueryHandler<GetAllRequestsQuery> {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly repository: Repository<RequestEntity>,
  ) {}

  async execute(): Promise<RequestEntity[]> {
    return await this.repository.find({
      relations: ['user'],
    });
  }
}
