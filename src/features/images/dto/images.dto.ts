import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AddImageDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  productId: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  position?: number;
}

export class UpdateImagePositionDto {
  @ApiProperty()
  @IsNumber()
  position: number;
}
