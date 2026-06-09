import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateColorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Hex color value e.g. #FF0000' })
  @IsString()
  @IsNotEmpty()
  color: string;
}
