import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeleteCarModelCommand } from './delete-car-model.command';
import { CarModel } from '../../../../shared/entities/car-model/car-model.entity'; 

@CommandHandler(DeleteCarModelCommand)
export class DeleteCarModelHandler implements ICommandHandler<DeleteCarModelCommand> {
  constructor(
    @InjectRepository(CarModel)
    private readonly carModelRepository: Repository<CarModel>,
  ) {}

  async execute(command: DeleteCarModelCommand): Promise<{ message: string }> {
    const carModel = await this.carModelRepository.findOne({
      where: { id: command.id },
    });
    if (!carModel) throw new NotFoundException('Car model not found');
    await this.carModelRepository.remove(carModel);
    return { message: 'Car model deleted successfully' };
  }
}
