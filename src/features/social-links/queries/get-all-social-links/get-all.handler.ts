import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllSocialLinksQuery } from './get-all.query';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialLink } from '../../../../shared/entities/soical-link/soical-link.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllSocialLinksQuery)
export class GetAllSocialLinksHandler implements IQueryHandler<GetAllSocialLinksQuery> {
  constructor(
    @InjectRepository(SocialLink) private readonly repo: Repository<SocialLink>,
  ) {}
  async execute(query: GetAllSocialLinksQuery): Promise<SocialLink[]> {
    return await this.repo.find();
  }
}
