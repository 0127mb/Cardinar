import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCarMakeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
}
