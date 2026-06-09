import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Language } from '../../../shared/entities/translation/translation.entity';

const languageSwaggerEnum = ['uz', 'ru'];

export class TranslationStaticInfoDto {
  @ApiPropertyOptional({ enum: languageSwaggerEnum })
  @IsEnum(Language)
  @IsOptional()
  lang?: Language;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  staticInfoId?: number;

  @ApiPropertyOptional({ example: 'Cardinar' })
  @IsString()
  @IsOptional()
  headerTitle?: string;

  @ApiPropertyOptional({ example: 'Products' })
  @IsString()
  @IsOptional()
  subNavbarTitle?: string;

  @ApiPropertyOptional({ example: 'Каталог' })
  @IsString()
  @IsOptional()
  navCatalog?: string;

  @ApiPropertyOptional({ example: 'Конструктор' })
  @IsString()
  @IsOptional()
  navConstructor?: string;

  @ApiPropertyOptional({ example: 'Где купить?' })
  @IsString()
  @IsOptional()
  navBranches?: string;

  @ApiPropertyOptional({ example: 'Контакты' })
  @IsString()
  @IsOptional()
  navContacts?: string;

  @ApiPropertyOptional({ example: 'Информация' })
  @IsString()
  @IsOptional()
  footerInformationTitle?: string;

  @ApiPropertyOptional({ example: 'Номер телефона' })
  @IsString()
  @IsOptional()
  footerPhoneTitle?: string;

  @ApiPropertyOptional({ example: 'Почта' })
  @IsString()
  @IsOptional()
  footerEmailTitle?: string;

  @ApiPropertyOptional({ example: 'Адрес (офис)' })
  @IsString()
  @IsOptional()
  footerAddressTitle?: string;

  @ApiPropertyOptional({ example: 'Нужна помощь с выбором?' })
  @IsString()
  @IsOptional()
  requestTitle?: string;

  @ApiPropertyOptional({ example: 'Оставьте контакты и мы перезвоним' })
  @IsString()
  @IsOptional()
  requestDescription?: string;

  @ApiPropertyOptional({ example: 'Tashkent, Uzbekistan' })
  @IsString()
  @IsOptional()
  address?: string;
}
