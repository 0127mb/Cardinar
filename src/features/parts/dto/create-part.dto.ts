import { IsString,  IsNumber, IsEnum,IsNotEmpty,IsOptional,} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryType } from '../../../shared/entities/custom-model/custom-model.entity';
import { part } from '../../../shared/enums/part.enum'; 

export class CreatePartDTO {
  @ApiProperty({ enum: CategoryType })
  @IsEnum(CategoryType)
  @IsNotEmpty()
  category: CategoryType;

  @ApiProperty({ enum: part })
  @IsEnum(part)
  @IsNotEmpty()
  part: part;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  materialId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  colorId: number;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  image?: string;
}
