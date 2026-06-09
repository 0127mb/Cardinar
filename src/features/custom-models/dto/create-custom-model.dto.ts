import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryType } from '../../../shared/entities/custom-model/custom-model.entity'; 

export class CreateCustomModelDTO {
  @ApiProperty({ enum: CategoryType })
  @IsEnum(CategoryType)
  @IsNotEmpty()
  category: CategoryType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  image?: string;
}
