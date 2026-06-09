import { IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSocialLinkDto {
  @ApiProperty() @IsString() @Length(1, 64) title: string;
  @ApiProperty() @IsString() link: string;
  @ApiPropertyOptional({ type: 'string', format:"binary" }) @IsOptional() icon?: string;
}

export class UpdateSocialLinkDto {
  @ApiProperty() @IsString() @Length(1, 64) title: string;
  @ApiProperty() @IsUrl() link: string;
  @ApiPropertyOptional({ type: 'string', format:"binary" }) @IsOptional() icon?: string;
}
