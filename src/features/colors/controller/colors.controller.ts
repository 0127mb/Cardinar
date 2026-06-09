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
import { GetAllColorsQuery } from '../queries/get-all-colors/get-all-colors.query';
import { GetColorByIdQuery } from '../queries/get-color-by-id/get-color-by-id.query';
import { CreateColorCommand } from '../commands/create-color/create-color.command';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { CreateColorDto } from '../dto/color.dto';
import { UpdateColorCommand } from '../commands/update-color/update-color.command';
import { DeleteColorCommand } from '../commands/delete-color/delete-color.command';

@ApiTags('Colors')
@Controller('colors')
export class ColorsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all colors' })
  findAll() {
    return this.queryBus.execute(new GetAllColorsQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get color by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new GetColorByIdQuery(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create color (admin only)' })
  create(@Body() dto: CreateColorDto) {
    return this.commandBus.execute(
      new CreateColorCommand(dto.title, dto.color),
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update color (admin only)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateColorDto) {
    return this.commandBus.execute(new UpdateColorCommand(id, dto));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete color (admin only)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteColorCommand(id));
  }
}
