import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllCarMakesQuery } from '../queries/get-all/get-all.query';
import { GetCarMakeByIdQuery } from '../queries/get-by-id/get-by-id.query';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { CreateCarMakeDto } from '../dto/car-make.dto';
import { CreateCarMakeCommand } from '../commands/create-car/create-car.command';
import { UpdateCarMakeCommand } from '../commands/update-car-make/update-car-make.command';
import { DeleteCarMakeCommand } from '../commands/delete-car-make/delete-car-make.command';

@ApiTags('Car Makes')
@Controller('car-makes')
export class CarMakesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all car makes' })
  findAll() {
    return this.queryBus.execute(new GetAllCarMakesQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get car make by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new GetCarMakeByIdQuery(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create car make (admin only)' })
  create(@Body() dto: CreateCarMakeDto) {
    return this.commandBus.execute(new CreateCarMakeCommand(dto.title));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update car make (admin only)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateCarMakeDto) {
    return this.commandBus.execute(new UpdateCarMakeCommand(id, dto.title));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete car make (admin only)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteCarMakeCommand(id));
  }
}
