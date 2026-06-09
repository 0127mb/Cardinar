import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeleteCarMakeCommand } from './delete-car-make.command';
import { CarMake } from '../../../../shared/entities/car.make/car.make.entity'; 

@CommandHandler(DeleteCarMakeCommand)
export class DeleteCarMakeHandler implements ICommandHandler<DeleteCarMakeCommand> {
  constructor(
    @InjectRepository(CarMake)
    private readonly carMakeRepository: Repository<CarMake>,
  ) {}

  async execute(command: DeleteCarMakeCommand): Promise<{ message: string }> {
    const carMake = await this.carMakeRepository.findOne({
      where: { id: command.id },
    });
    if (!carMake) throw new NotFoundException('Car make not found');
    await this.carMakeRepository.remove(carMake);
    return { message: 'Car make deleted successfully' };
  }
}
