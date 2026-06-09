import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { GetColorByIdQuery } from './get-color-by-id.query';
import { Color } from '../../../../shared/entities/color/color.entity'; 

@QueryHandler(GetColorByIdQuery)
export class GetColorByIdHandler implements IQueryHandler<GetColorByIdQuery> {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  async execute(query: GetColorByIdQuery): Promise<Color> {
    const color = await this.colorRepository.findOne({
      where: { id: query.id },
    });
    if (!color) throw new NotFoundException('Color not found');
    return color;
  }
}
