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
import { GetAllCategoriesQuery } from '../queries/get-all-categories/get-all-categories.query';
import { GetCategoryByIdQuery } from '../queries/get-categories-by-id/get-categories-by-id.query';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { CreateCategoryDto } from '../dto/category.dto';
import { CreateCategoryCommand } from '../commands/create-category/create-category.command';
import { UpdateCategoryCommand } from '../commands/update-category/update-category.command';
import { DeleteCategoryCommand } from '../commands/delete-category/delete-category.command';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  findAll() {
    return this.queryBus.execute(new GetAllCategoriesQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new GetCategoryByIdQuery(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create category (admin only)' })
  create(@Body() dto: CreateCategoryDto) {
    return this.commandBus.execute(new CreateCategoryCommand(dto.title));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category (admin only)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.commandBus.execute(new UpdateCategoryCommand(id, dto.title));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category (admin only)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteCategoryCommand(id));
  }
}
