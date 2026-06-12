import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCustomModelDTO } from '../dto/create-custom-model.dto';
import { UpdateCustomModelDTO } from '../dto/update-custom-model.dto';
import { CreateCustomModelCommand } from '../commands/create-custom-model/create-custom-model.command';
import { UpdateCustomModelCommand } from '../commands/update-custom-model/update-custom-model.command';
import { DeleteCustomModelCommand } from '../commands/delete-custom-model/delete-custom-model.command';
import { GetAllCustomModelsQuery } from '../queries/get-all-custom-models/get-all-custom-models.query';
import { GetCustomModelByIdQuery } from '../queries/get-custom-model-by-id/get-custom-model-by-id.query';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { multerConfig } from '../../../shared/common/config/multer.config';
import { CloudinaryService } from '../../../shared/cloudinary/cloudinary.service';

@ApiTags('Custom Models')
@Controller('custom-models')
export class CustomModelsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create constructor base model with its own image' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['category', 'title', 'image'],
      properties: {
        category: { type: 'string', enum: ['cover', 'carpet'] },
        title: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateCustomModelDTO,
  ) {
    const image = file
      ? await this.cloudinaryService.uploadImage(file, 'cardinar/custom-models')
      : dto.image;
    if (!image) throw new BadRequestException('Custom model image is required');

    return await this.commandBus.execute(
      new CreateCustomModelCommand(dto.category, dto.title, image),
    );
  }

  @Get()
  async getAll() {
    return await this.queryBus.execute(new GetAllCustomModelsQuery());
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.queryBus.execute(new GetCustomModelByIdQuery(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update constructor base model and optionally replace its image',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateCustomModelDTO,
  ) {
    const image = file
      ? await this.cloudinaryService.uploadImage(file, 'cardinar/custom-models')
      : dto.image;

    return await this.commandBus.execute(
      new UpdateCustomModelCommand(id, dto.title, image),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.commandBus.execute(new DeleteCustomModelCommand(id));
  }
}
