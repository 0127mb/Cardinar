import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request as RequestEntity } from '../../../../shared/entities/request/request.entity';
import { DeleteRequestCommand } from './delete-request.command';

@CommandHandler(DeleteRequestCommand)
export class DeleteRequestHandler implements ICommandHandler<DeleteRequestCommand> {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly repository: Repository<RequestEntity>,
  ) {}

  async execute(command: DeleteRequestCommand): Promise<void> {
    try {
      const request = await this.repository.findOne({
        where: { id: command.id },
      });

      if (!request) {
        throw new NotFoundException('Request not found');
      }

      await this.repository.remove(request);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete request');
    }
  }
}
