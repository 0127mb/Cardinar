import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateCarModelCommand } from './update-car-model.command';
import { CarModel } from '../../../../shared/entities/car-model/car-model.entity';

@CommandHandler(UpdateCarModelCommand)
export class UpdateCarModelHandler implements ICommandHandler<UpdateCarModelCommand> {
  constructor(
    @InjectRepository(CarModel)
    private readonly carModelRepository: Repository<CarModel>,
  ) {}

  async execute(command: UpdateCarModelCommand): Promise<CarModel> {
    const carModel = await this.carModelRepository.findOne({
      where: { id: command.id },
    });
    if (!carModel) throw new NotFoundException('Car model not found');

    if (command.title) carModel.title = command.title;
    if (command.carMakeId) carModel.carMakeId = command.carMakeId;

    return this.carModelRepository.save(carModel);
  }
}
