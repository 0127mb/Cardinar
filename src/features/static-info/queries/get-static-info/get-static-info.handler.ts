import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { StaticInfo } from '../../../../shared/entities/static.info/static.info.entity'; 
import { GetStaticInfoQuery } from './get-static-info.query';

@QueryHandler(GetStaticInfoQuery)
export class GetStaticInfoHandler implements IQueryHandler<GetStaticInfoQuery> {
  constructor(
    @InjectRepository(StaticInfo)
    private readonly repository: Repository<StaticInfo>,
  ) {}

  async execute(): Promise<StaticInfo> {
    const staticInfo = await this.repository.findOne({ where: { id: 1 } });

    if (!staticInfo) {
      throw new NotFoundException('Static info not found');
    }

    return staticInfo;
  }
}
