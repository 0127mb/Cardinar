import { IsString, IsHexColor, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateColorDto {
  @ApiProperty({
    example: 'Black',
    description: 'Color name/title',
  })
  @IsString()
  @Length(1, 64)
  title: string;

  @ApiProperty({
    example: '#000000',
    description: 'Hex color code',
  })
  @IsHexColor()
  color: string;
}
