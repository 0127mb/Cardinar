import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeleteCategoryCommand } from './delete-category.command';
import { Category } from '../../../../shared/entities/category/category.entity'; 

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler implements ICommandHandler<DeleteCategoryCommand> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(command: DeleteCategoryCommand): Promise<{ message: string }> {
    const category = await this.categoryRepository.findOne({
      where: { id: command.id },
    });
    if (!category) throw new NotFoundException('Category not found');
    await this.categoryRepository.remove(category);
    return { message: 'Category deleted successfully' };
  }
}
