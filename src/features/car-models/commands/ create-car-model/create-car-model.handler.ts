import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateCarModelCommand } from './create-car-model.command';
import { CarModel } from '../../../../shared/entities/car-model/car-model.entity'; 
import { CarMake } from '../../../../shared/entities/car.make/car.make.entity'; 
@CommandHandler(CreateCarModelCommand)
export class CreateCarModelHandler implements ICommandHandler<CreateCarModelCommand> {
  constructor(
    @InjectRepository(CarModel)
    private readonly carModelRepository: Repository<CarModel>,
    @InjectRepository(CarMake)
    private readonly carMakeRepository: Repository<CarMake>,
  ) {}

  async execute(command: CreateCarModelCommand): Promise<CarModel> {
    const carMake = await this.carMakeRepository.findOne({
      where: { id: command.carMakeId },
    });
    if (!carMake) throw new NotFoundException('Car make not found');

    const existing = await this.carModelRepository.findOne({
      where: { title: command.title },
    });
    if (existing) throw new ConflictException('Car model already exists');

    const carModel = this.carModelRepository.create({
      title: command.title,
      carMakeId: command.carMakeId,
    });
    return this.carModelRepository.save(carModel);
  }
}
