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

import {
  CreateSocialLinkDto,
  UpdateSocialLinkDto,
} from '../dto/social-link.dto';
import { CreateSocialLinkCommand } from '../commands/create-social-link/create-social-link.command';
import { UpdateSocialLinkCommand } from '../commands/update-social-link/update-social-link.command';
import { DeleteSocialLinkCommand } from '../commands/delete-social-link/delete-social-link.command';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { SocialLink } from '../../../shared/entities/soical-link/soical-link.entity';
import { GetAllSocialLinksQuery } from '../queries/get-all-social-links/get-all.query';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../../shared/common/config/multer.config';
import { CloudinaryService } from '../../../shared/cloudinary/cloudinary.service';

@ApiTags('Social Links')
@Controller('social-links')
export class SocialLinksController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  // @UseGuards(JwtAuthGuard, AdminGuard)
  // @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('icon', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'link', 'icon'],
      properties: {
        title: { type: 'string' },
        link: { type: 'string' },
        icon: { type: 'string', format: 'binary' },
      },
    },
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateSocialLinkDto,
  ): Promise<SocialLink> {
    const icon = file
      ? await this.cloudinaryService.uploadImage(file, 'cardinar/social-links')
      : dto.icon;
    if (!icon) throw new BadRequestException('Social link icon is required');

    return this.commandBus.execute(
      new CreateSocialLinkCommand(dto.title, dto.link, icon),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all social links' })
  async findAll(): Promise<SocialLink[]> {
    return this.queryBus.execute(new GetAllSocialLinksQuery());
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update social link' })
  @UseInterceptors(FileInterceptor('icon', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'link'],
      properties: {
        title: { type: 'string' },
        link: { type: 'string' },
        icon: { type: 'string', format: 'binary' },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateSocialLinkDto,
  ): Promise<SocialLink> {
    const icon = file
      ? await this.cloudinaryService.uploadImage(file, 'cardinar/social-links')
      : dto.icon;

    return this.commandBus.execute(
      new UpdateSocialLinkCommand(+id, dto.title, dto.link, icon),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete social link' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteSocialLinkCommand(+id));
  }
}
