import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDTO {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  quantity: number;
}
