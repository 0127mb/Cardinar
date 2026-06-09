import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetAllCarModelsQuery } from '../queries/get-all/get-all.query';
import { GetCarModelByIdQuery } from '../queries/get-by-id/get-by-id.handler';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { CreateCarModelDto } from '../dto/car-models.dto';
import { CreateCarModelCommand } from '../commands/ create-car-model/create-car-model.command';
import { UpdateCarModelCommand } from '../commands/update-car-model/update-car-model.command';
import { DeleteCarModelCommand } from '../commands/delete-car-model/delete-car-model.command';

@ApiTags('Car Models')
@Controller('car-models')
export class CarModelsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all car models, optionally filter by carMakeId',
  })
  @ApiQuery({ name: 'carMakeId', required: false, type: Number })
  findAll(@Query('carMakeId') carMakeId?: number) {
    return this.queryBus.execute(new GetAllCarModelsQuery(carMakeId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get car model by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new GetCarModelByIdQuery(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create car model (admin only)' })
  create(@Body() dto: CreateCarModelDto) {
    return this.commandBus.execute(
      new CreateCarModelCommand(dto.title, dto.carMakeId),
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update car model (admin only)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateCarModelDto>,
  ) {
    return this.commandBus.execute(
      new UpdateCarModelCommand(id, dto.title, dto.carMakeId),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete car model (admin only)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteCarModelCommand(id));
  }
}
