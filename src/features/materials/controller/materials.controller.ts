import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { Material } from '../../../shared/entities/material/material.entity'; 
import { CreateMaterialDto, UpdateMaterialDto } from '../dto/material.dto';
import { CreateMaterialCommand } from '../commands/create-material/create-material.command';
import { UpdateMaterialCommand } from '../commands/update-material/update-material.command';
import { DeleteMaterialCommand } from '../commands/delete-material/delete-material.command';
import { GetAllMaterialsQuery } from '../queries/get-all-materials/get-all-materials.query';
import { GetMaterialByIdQuery } from '../queries/get-material-by-id/get-material-by-id.query';

@ApiTags('Materials')
@Controller('materials')
export class MaterialsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new material' })
  async create(
    @Body() createMaterialDto: CreateMaterialDto,
  ): Promise<Material> {
    return this.commandBus.execute(
      new CreateMaterialCommand(
        createMaterialDto.title,
        createMaterialDto.description,
      ),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all materials' })
  async findAll(): Promise<Material[]> {
    return this.queryBus.execute(new GetAllMaterialsQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get material by ID' })
  async findOne(@Param('id') id: string): Promise<Material> {
    return this.queryBus.execute(new GetMaterialByIdQuery(+id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update material' })
  async update(
    @Param('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ): Promise<Material> {
    return this.commandBus.execute(
      new UpdateMaterialCommand(
        +id,
        updateMaterialDto.title,
        updateMaterialDto.description,
      ),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete material' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteMaterialCommand(+id));
  }
}
