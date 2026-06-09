import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from './get-users.query';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../shared/entities/user/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}
  async execute(query: GetUserQuery): Promise<User[]> {
    const { id, phoneNumber, email, fullName } = query;
    const Condition: FindOptionsWhere<User>[] = [];
    if (id) Condition.push({ id });
    if (phoneNumber) Condition.push({ phoneNumber });
    if (email) Condition.push({ email });
    if (fullName) Condition.push({ fullName });
    if (Condition.length === 0) {
      throw new NotFoundException('user not found or not added');
    }
    const user = await this.user.find({
      where: Condition,
    });
    return user;
  }
}
