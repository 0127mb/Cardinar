import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateArticulDTO } from '../dto/create-articul.dto';
import { UpdateArticulDTO } from '../dto/update-articul.dto';
import { CreateArticulCommand } from '../commands/create-articul/create-articul.command';
import { UpdateArticulCommand } from '../commands/update-articul/update-articul.command';
import { DeleteArticulCommand } from '../commands/delete-articul/delete-articul.command';
import { GetAllArticulsQuery } from '../queries/get-all-articuls/get-all-articuls.query';
import { GetArticulByIdQuery } from '../queries/get-articul-by-id/get-articul-by-id.query';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { AdminGuard } from '../../../shared/guards/admin.guard';

@Controller('articuls')
export class ArticulsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() dto: CreateArticulDTO) {
    return await this.commandBus.execute(
      new CreateArticulCommand(dto.productId, dto.carModelId),
    );
  }

  @Get()
  async getAll() {
    return await this.queryBus.execute(new GetAllArticulsQuery());
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.queryBus.execute(new GetArticulByIdQuery(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateArticulDTO) {
    return await this.commandBus.execute(
      new UpdateArticulCommand(id, dto.productId, dto.carModelId),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.commandBus.execute(new DeleteArticulCommand(id));
  }
}
