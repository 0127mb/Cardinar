import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { Banner } from '../../../shared/entities/banner/banner.entity';
import { CreateBannerDto, UpdateBannerDto } from '../dto/banner.dto';
import { CreateBannerCommand } from '../commands/create-banner/create-banner.command';
import { UpdateBannerCommand } from '../commands/update-banner/update-banner.command';
import { DeleteBannerCommand } from '../commands/delete-banner/delete-banner.command';
import { GetAllBannersQuery } from '../queries/get-all-banners/get-all-banners.query';
import { GetBannerByIdQuery } from '../queries/get-banner-by-id/get-banner-by-id.query';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../../shared/common/config/multer.config';
import { CloudinaryService } from '../../../shared/cloudinary/cloudinary.service';

@ApiTags('Banners')
@Controller('banners')
export class BannersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create banner' })
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'image'],
      properties: {
        title: {
          type: 'string',
          description:
            'Default banner title used when translations are missing',
        },
        image: { type: 'string', format: 'binary' },
        isActive: { type: 'boolean', default: false },
        titleRu: { type: 'string', description: 'Russian banner title' },
        descriptionRu: {
          type: 'string',
          description: 'Russian banner description',
        },
        titleUz: { type: 'string', description: 'Uzbek banner title' },
        descriptionUz: {
          type: 'string',
          description: 'Uzbek banner description',
        },
      },
    },
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateBannerDto,
  ): Promise<Banner> {
    const image = file
      ? await this.cloudinaryService.uploadImage(file, 'cardinar/banners')
      : dto.image;
    if (!image) throw new BadRequestException('Banner image is required');

    return this.commandBus.execute(
      new CreateBannerCommand(dto.title, image, dto.isActive ?? false, {
        titleRu: dto.titleRu,
        descriptionRu: dto.descriptionRu,
        titleUz: dto.titleUz,
        descriptionUz: dto.descriptionUz,
      }),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all banners' })
  async findAll(): Promise<Banner[]> {
    return this.queryBus.execute(new GetAllBannersQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get banner by ID' })
  async findOne(@Param('id') id: string): Promise<Banner> {
    return this.queryBus.execute(new GetBannerByIdQuery(+id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update banner' })
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'isActive'],
      properties: {
        title: {
          type: 'string',
          description:
            'Default banner title used when translations are missing',
        },
        image: { type: 'string', format: 'binary' },
        isActive: { type: 'boolean' },
        titleRu: { type: 'string', description: 'Russian banner title' },
        descriptionRu: {
          type: 'string',
          description: 'Russian banner description',
        },
        titleUz: { type: 'string', description: 'Uzbek banner title' },
        descriptionUz: {
          type: 'string',
          description: 'Uzbek banner description',
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateBannerDto,
  ): Promise<Banner> {
    const image = file
      ? await this.cloudinaryService.uploadImage(file, 'cardinar/banners')
      : dto.image;

    return this.commandBus.execute(
      new UpdateBannerCommand(+id, dto.title, image, dto.isActive, {
        titleRu: dto.titleRu,
        descriptionRu: dto.descriptionRu,
        titleUz: dto.titleUz,
        descriptionUz: dto.descriptionUz,
      }),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete banner' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteBannerCommand(+id));
  }
}
