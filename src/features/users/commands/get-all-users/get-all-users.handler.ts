import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllUsersQuery } from './get.all-user.query';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../shared/entities/user/user.entity'; 
import { Repository } from 'typeorm';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersHandler> {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  async execute(query: GetAllUsersQuery): Promise<User[]> {
    return this.user.find();
  }
}
