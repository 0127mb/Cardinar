import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllColorsQuery } from './get-all-colors.query';
import { Color } from '../../../../shared/entities/color/color.entity';

@QueryHandler(GetAllColorsQuery)
export class GetAllColorsHandler implements IQueryHandler<GetAllColorsQuery> {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  async execute(): Promise<Color[]> {
    return this.colorRepository.find();
  }
}
