import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetProductImagesQuery } from '../queries/get/get-product-images.query';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { multerConfig } from '../../../shared/common/config/multer.config';
import { AddImageDto, UpdateImagePositionDto } from '../dto/images.dto';
import { AddImageCommand } from '../commands/add/add-image.handeler';
import { UpdateImagePositionCommand } from '../commands/update/update-image.command';
import { DeleteImageCommand } from '../commands/delete/delete-image.command';
import { CloudinaryService } from '../../../shared/cloudinary/cloudinary.service';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // Get all images for a product
  @Get('product/:productId')
  @ApiOperation({ summary: 'Get all images for a product' })
  getProductImages(@Param('productId', ParseIntPipe) productId: number) {
    return this.queryBus.execute(new GetProductImagesQuery(productId));
  }

  // Upload single image
  @Post('upload')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload single image for a product (admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        productId: { type: 'number' },
        position: { type: 'number' },
      },
    },
  })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: AddImageDto,
  ) {
    if (!file) {
      throw new BadRequestException('Product image is required');
    }
    const imageUrl = await this.cloudinaryService.uploadImage(
      file,
      'cardinar/products',
    );

    return this.commandBus.execute(
      new AddImageCommand(dto.productId, imageUrl, dto.position),
    );
  }

  // Upload multiple images at once
  @Post('upload-many')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload multiple images for a product (admin only)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        productId: { type: 'number' },
      },
    },
  })
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: AddImageDto,
  ) {
    if (!files?.length) {
      throw new BadRequestException('At least one product image is required');
    }

    const imageUrls = await Promise.all(
      files.map((file) =>
        this.cloudinaryService.uploadImage(file, 'cardinar/products'),
      ),
    );

    return Promise.all(
      imageUrls.map((imageUrl) =>
        this.commandBus.execute(new AddImageCommand(dto.productId, imageUrl)),
      ),
    );
  }

  // Update image position
  @Patch(':id/position')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update image position (admin only)' })
  updatePosition(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateImagePositionDto,
  ) {
    return this.commandBus.execute(
      new UpdateImagePositionCommand(id, dto.position),
    );
  }

  // Delete image
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete image (admin only)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteImageCommand(id));
  }
}
