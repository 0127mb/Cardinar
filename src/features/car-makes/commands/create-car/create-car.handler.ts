import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { CreateCarMakeCommand } from './create-car.command';
import { CarMake } from '../../../../shared/entities/car.make/car.make.entity'; 

@CommandHandler(CreateCarMakeCommand)
export class CreateCarMakeHandler implements ICommandHandler<CreateCarMakeCommand> {
  constructor(
    @InjectRepository(CarMake)
    private readonly carMakeRepository: Repository<CarMake>,
  ) {}

  async execute(command: CreateCarMakeCommand): Promise<CarMake> {
    const existing = await this.carMakeRepository.findOne({
      where: { title: command.title },
    });
    if (existing) throw new ConflictException('Car make already exists');

    const carMake = this.carMakeRepository.create({ title: command.title });
    return this.carMakeRepository.save(carMake);
  }
}
