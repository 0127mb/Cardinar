import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductStatus } from '../../../shared/entities/product/product.entity'; 

export class CreateProductDto {
  @ApiProperty()
  @IsNumber()
  categoryId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  @ApiPropertyOptional({ type: [Number], description: 'Array of colorIds' })
  @IsOptional()
  colorIds?: number[];

  @ApiPropertyOptional({
    type: [Number],
    description: 'Array of carModelIds for articuls',
  })
  @IsOptional()
  carModelIds?: number[];
}
export class UpdateProductDto extends PartialType(CreateProductDto) {}
