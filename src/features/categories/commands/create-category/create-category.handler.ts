import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { CreateCategoryCommand } from './create-category.command';
import { Category } from '../../../../shared/entities/category/category.entity';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<Category> {
    const existing = await this.categoryRepository.findOne({
      where: { title: command.title },
    });
    if (existing) throw new ConflictException('Category already exists');

    const category = this.categoryRepository.create({ title: command.title });
    return this.categoryRepository.save(category);
  }
}
