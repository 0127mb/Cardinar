import { IsString, IsBoolean, Length, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type BannerTranslationFields = {
  titleRu?: string;
  descriptionRu?: string;
  titleUz?: string;
  descriptionUz?: string;
};

const EmptyToUndefined = () =>
  Transform(({ value }) => (value === '' ? undefined : value));

export class CreateBannerDto {
  @ApiProperty() @IsString() @Length(1, 128) title: string;
  @ApiPropertyOptional({ type: "string", format: "binary" }) @EmptyToUndefined() @IsOptional() image?: string;
  @ApiProperty({ default: false }) @Transform(({ value }) => value === true || value === 'true') @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional({ description: 'Russian banner title' }) @EmptyToUndefined() @IsOptional() @IsString() @Length(1, 128) titleRu?: string;
  @ApiPropertyOptional({ description: 'Russian banner description' }) @EmptyToUndefined() @IsOptional() @IsString() descriptionRu?: string;
  @ApiPropertyOptional({ description: 'Uzbek banner title' }) @EmptyToUndefined() @IsOptional() @IsString() @Length(1, 128) titleUz?: string;
  @ApiPropertyOptional({ description: 'Uzbek banner description' }) @EmptyToUndefined() @IsOptional() @IsString() descriptionUz?: string;
}

export class UpdateBannerDto {
  @ApiProperty() @IsString() @Length(1, 128) title: string;
  @ApiPropertyOptional({ type: "string", format: "binary" }) @EmptyToUndefined() @IsOptional() image?: string;
  @ApiProperty() @Transform(({ value }) => value === true || value === 'true') @IsBoolean() isActive: boolean;
  @ApiPropertyOptional({ description: 'Russian banner title' }) @EmptyToUndefined() @IsOptional() @IsString() @Length(1, 128) titleRu?: string;
  @ApiPropertyOptional({ description: 'Russian banner description' }) @EmptyToUndefined() @IsOptional() @IsString() descriptionRu?: string;
  @ApiPropertyOptional({ description: 'Uzbek banner title' }) @EmptyToUndefined() @IsOptional() @IsString() @Length(1, 128) titleUz?: string;
  @ApiPropertyOptional({ description: 'Uzbek banner description' }) @EmptyToUndefined() @IsOptional() @IsString() descriptionUz?: string;
}
