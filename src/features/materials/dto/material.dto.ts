import { IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaterialDto {
  @ApiProperty({ example: 'Leather' })
  @IsString()
  @Length(1, 64)
  title: string;

  @ApiProperty({ example: 'Premium leather material', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 512)
  description?: string;
}

export class UpdateMaterialDto {
  @ApiProperty({ example: 'Leather' })
  @IsString()
  @Length(1, 64)
  title: string;

  @ApiProperty({ example: 'Premium leather material', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 512)
  description?: string;
}
