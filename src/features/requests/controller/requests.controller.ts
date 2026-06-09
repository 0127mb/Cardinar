import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateRequestDTO } from '../dto/create-request.dto';
import { CreateRequestCommand } from '../commands/create-request/create-request.command';
import { DeleteRequestCommand } from '../commands/delete-request/delete-request.command';
import { GetAllRequestsQuery } from '../queries/get-all-requests/get-all-requests.query';
import { GetRequestByIdQuery } from '../queries/get-request-by-id/get-request-by-id.query';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { AdminGuard } from '../../../shared/guards/admin.guard';

@Controller('requests')
export class RequestsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateRequestDTO) {
    return await this.commandBus.execute(
      new CreateRequestCommand(
        dto.userId,
        dto.fullName,
        dto.phoneNumber,
        dto.email || null,
        dto.comments,
      ),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAll() {
    return await this.queryBus.execute(new GetAllRequestsQuery());
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.queryBus.execute(new GetRequestByIdQuery(id));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.commandBus.execute(new DeleteRequestCommand(id));
  }
}
