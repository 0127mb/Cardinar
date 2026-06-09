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
import { CreateBranchDto } from '../dto/branches.dto';
import { UpdateBranchDto } from '../dto/branches.dto';
import { CreateBranchCommand } from '../commands/create-branch/create-branch.command';
import { UpdateBranchCommand } from '../commands/update-branch/update.branch.command';
import { DeleteBranchCommand } from '../commands/delete-branch/delete-branch.command';
import { GetAllBranchesQuery } from '../queries/get-all-branches/get-all-baranches.command';
import { GetBranchByIdQuery } from '../queries/get-branches-by-query/get-branches-by-query';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { AdminGuard } from '../../../shared/guards/admin.guard';

@ApiTags('Branches')
@Controller('branches')
export class BranchesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // Public
  @Get()
  @ApiOperation({ summary: 'Get all branches' })
  @ApiQuery({ name: 'onlyActive', required: false, type: Boolean })
  findAll(@Query('onlyActive') onlyActive?: boolean) {
    return this.queryBus.execute(new GetAllBranchesQuery(onlyActive));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get branch by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new GetBranchByIdQuery(id));
  }

  // Admin only
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create branch (admin only)' })
  create(@Body() dto: CreateBranchDto) {
    return this.commandBus.execute(
      new CreateBranchCommand(
        dto.title,
        dto.address,
        dto.phoneNumber,
        dto.longitude,
        dto.latitude,
        dto.branchType,
        dto.district,
        dto.region,
        dto.isActive,
      ),
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update branch (admin only)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBranchDto) {
    return this.commandBus.execute(new UpdateBranchCommand(id, dto));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete branch (admin only)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteBranchCommand(id));
  }
}
