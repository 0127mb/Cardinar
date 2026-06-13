import {
  Body,
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  UseGuards,
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
import { CreateUserDto, GetUserDto, UpdateUserDto } from '../dto/user.dto';
import { CreateUserCommand } from '../commands/create-user/create-user.command';
import { GetAllUsersQuery } from '../commands/get-all-users/get.all-user.query';
import { GetUserQuery } from '../commands/get-users-by-information/get-users.query';
import { UpdateUserCommand } from '../commands/update-user/update-user.command';
import { DeleteUserCommand } from '../commands/delete-user/delete-user.command';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { CurrentUser } from '../../../shared/common/decorators/current-user.decorator';
import { multerConfig } from '../../../shared/common/config/multer.config';
import { User } from '../../../shared/entities/user/user.entity';
import { UpdateProfileImageCommand } from '../commands/update-profile-image/update-profile-image.command';
import { CloudinaryService } from '../../../shared/cloudinary/cloudinary.service';

@Controller('User')
@ApiTags('User')
export class UsersController {
  constructor(
    private readonly cBus: CommandBus,
    private readonly qBus: QueryBus,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Post('Create-user')
  createuser(@Body() dto: CreateUserDto) {
    return this.cBus.execute(
      new CreateUserCommand(
        dto.fullName,
        dto.phoneNumber,
        dto.password,
        dto.isAdmin ?? false,
        dto.isActive ?? true,
      ),
    );
  }
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Get('get-All')
  getAll(query: GetAllUsersQuery) {
    return this.qBus.execute(new GetAllUsersQuery());
  }
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  findOne(@Query() querry: GetAllUsersQuery, @Body() dto: GetUserDto) {
    return this.qBus.execute(
      new GetUserQuery(dto.id, dto.fullName, dto.phoneNumber),
    );
  }
  @UseGuards(JwtAuthGuard)
  @Patch('profile-image')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload or replace current user profile image' })
  @UseInterceptors(FileInterceptor('profileImage', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['profileImage'],
      properties: {
        profileImage: { type: 'string', format: 'binary' },
      },
    },
  })
  async updateProfileImage(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Profile image is required');
    }

    const profileImage = await this.cloudinaryService.uploadImage(
      file,
      'cardinar/users',
    );
    const updatedUser = await this.cBus.execute(
      new UpdateProfileImageCommand(user.id, profileImage),
    );

    return {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      phoneNumber: updatedUser.phoneNumber,
      profileImage: updatedUser.profileImage,
      isAdmin: updatedUser.isAdmin,
      isActive: updatedUser.isActive,
    };
  }
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.cBus.execute(
      new UpdateUserCommand(
        id,
        dto.fullName,
        dto.password,
        dto.phoneNumber,
        dto.isAdmin,
        dto.isActive,
      ),
    );
  }
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.cBus.execute(new DeleteUserCommand(id));
  }
}
