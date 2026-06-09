import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { part } from '../../../shared/enums/part.enum';
import { CategoryType } from '../../../shared/entities/custom-model/custom-model.entity'; 
export class UpdatePartDTO {
  @ApiPropertyOptional({ enum: CategoryType })
  @IsEnum(CategoryType)
  @IsOptional()
  category?: CategoryType;

  @ApiPropertyOptional({ enum: part })
  @IsEnum(part)
  @IsOptional()
  part?: part;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  materialId?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  colorId?: number;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  image?: string;
}
