import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateCarMakeCommand } from './update-car-make.command';
import { CarMake } from '../../../../shared/entities/car.make/car.make.entity';

@CommandHandler(UpdateCarMakeCommand)
export class UpdateCarMakeHandler implements ICommandHandler<UpdateCarMakeCommand> {
  constructor(
    @InjectRepository(CarMake)
    private readonly carMakeRepository: Repository<CarMake>,
  ) {}

  async execute(command: UpdateCarMakeCommand): Promise<CarMake> {
    const carMake = await this.carMakeRepository.findOne({
      where: { id: command.id },
    });
    if (!carMake) throw new NotFoundException('Car make not found');

    carMake.title = command.title;
    return this.carMakeRepository.save(carMake);
  }
}
