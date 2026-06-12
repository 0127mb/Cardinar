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
import { CreatePartDTO } from '../dto/create-part.dto';
import { UpdatePartDTO } from '../dto/update-part.dto';
import { CreatePartCommand } from '../commands/create-part/create-part.command';
import { UpdatePartCommand } from '../commands/update-part/update-part.command';
import { DeletePartCommand } from '../commands/delete-part/delete-part.command';
import { GetAllPartsQuery } from '../queries/get-all-parts/get-all-parts.query';
import { GetPartByIdQuery } from '../queries/get-part-by-id/get-part-by-id.query';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { multerConfig } from '../../../shared/common/config/multer.config';
import { CloudinaryService } from '../../../shared/cloudinary/cloudinary.service';

@ApiTags('Parts')
@Controller('parts')
export class PartsController {
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
  @ApiOperation({
    summary: 'Create custom constructor part with its own image',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['category', 'part', 'materialId', 'colorId', 'image'],
      properties: {
        category: { type: 'string', enum: ['cover', 'carpet'] },
        part: { type: 'string', enum: ['central', 'rare', 'side', 'stitch'] },
        title: { type: 'string' },
        materialId: { type: 'number' },
        colorId: { type: 'number' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePartDTO,
  ) {
    const image = file
      ? await this.cloudinaryService.uploadImage(file, 'cardinar/parts')
      : dto.image;
    if (!image) throw new BadRequestException('Part image is required');

    return await this.commandBus.execute(
      new CreatePartCommand(
        dto.category,
        dto.part,
        dto.title || null,
        dto.materialId,
        dto.colorId,
        image,
      ),
    );
  }

  @Get()
  async getAll() {
    return await this.queryBus.execute(new GetAllPartsQuery());
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.queryBus.execute(new GetPartByIdQuery(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update custom constructor part and optionally replace its image',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        category: { type: 'string', enum: ['cover', 'carpet'] },
        part: { type: 'string', enum: ['central', 'rare', 'side', 'stitch'] },
        title: { type: 'string' },
        materialId: { type: 'number' },
        colorId: { type: 'number' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdatePartDTO,
  ) {
    const image = file
      ? await this.cloudinaryService.uploadImage(file, 'cardinar/parts')
      : dto.image;

    return await this.commandBus.execute(
      new UpdatePartCommand(
        id,
        dto.category,
        dto.part,
        dto.title,
        dto.materialId,
        dto.colorId,
        image,
      ),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.commandBus.execute(new DeletePartCommand(id));
  }
}
