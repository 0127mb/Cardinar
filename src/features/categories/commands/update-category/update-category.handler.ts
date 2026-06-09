import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateCategoryCommand } from './update-category.command';
import { Category } from '../../../../shared/entities/category/category.entity';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(command: UpdateCategoryCommand): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: command.id },
    });
    if (!category) throw new NotFoundException('Category not found');

    category.title = command.title;
    return this.categoryRepository.save(category);
  }
}
