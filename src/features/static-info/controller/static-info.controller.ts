import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateStaticInfoDTO } from '../dto/update-static-info.dto';
import { UpdateStaticInfoCommand } from '../commands/update-static-info/update-static-info.command';
import { GetStaticInfoQuery } from '../queries/get-static-info/get-static-info.query';
import { JwtAuthGuard } from '../../../shared/guards/jwt.auth.guard';
import { AdminGuard } from '../../../shared/guards/admin.guard';
import { CreateStaticInfoDTO } from '../dto/create-static.info.dto';
import { CreateStaticInfoCommand } from '../commands/create-static-info/static.command';
import { Language } from '../../../shared/entities/translation/translation.entity';
import { GetTranslationStaticInfoQuery } from '../queries/get-translation-static-info/get-translation-static-info.query';

const languageSwaggerEnum = ['uz', 'ru'];

@ApiTags('Static Info')
@Controller('static-info')
export class StaticInfoController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('get')
  @ApiOperation({ summary: 'Get static info' })
  async get() {
    return await this.queryBus.execute(new GetStaticInfoQuery());
  }

  @Get('translation')
  @ApiOperation({ summary: 'Get translated static info by language' })
  @ApiQuery({ name: 'lang', enum: languageSwaggerEnum })
  async getTranslation(@Query('lang') lang: string) {
    return await this.queryBus.execute(
      new GetTranslationStaticInfoQuery(lang as Language),
    );
  }

  @Put('update')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Update static info' })
  async update(@Body() dto: UpdateStaticInfoDTO) {
    return await this.commandBus.execute(
      new UpdateStaticInfoCommand(
        dto.address,
        dto.phoneNumber,
        dto.workingHours,
        dto.email,
        dto.translations,
      ),
    );
  }
  @Post('post')
  @ApiOperation({ summary: 'Create static info' })
  async post(@Body() dto: CreateStaticInfoDTO) {
    return await this.commandBus.execute(
      new CreateStaticInfoCommand(
        dto.address,
        dto.phoneNumber,
        dto.workingHours,
        dto.email,
        dto.translations,
      ),
    );
  }
}
