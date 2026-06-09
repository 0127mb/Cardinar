import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
  import { Request } from '../../../../shared/entities/request/request.entity';
import { CreateRequestCommand } from './create-request.command';

@CommandHandler(CreateRequestCommand)
export class CreateRequestHandler implements ICommandHandler<CreateRequestCommand> {
  constructor(
    @InjectRepository(Request)
    private readonly repository: Repository<Request>,
  ) {}

  async execute(command: CreateRequestCommand): Promise<Request> {
    try {
      const request = this.repository.create({
        userId: command.userId ?? null,
        fullName: command.fullName,
        phoneNumber: command.phoneNumber,
        email: command.email ?? null,
        comments: command.comments ?? null,
      });

      const save = await this.repository.save(request);
      return  save
    } catch (error) {
      throw new InternalServerErrorException('Failed to create request');
    }
  }
}
