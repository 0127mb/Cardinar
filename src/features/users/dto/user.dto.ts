import {
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
  IsBoolean,
  Matches,
  MaxLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  fullName: string;

  @ApiProperty({ example: '+998901234567' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(/^\+?[1-9]\d{7,14}$/)
  phoneNumber: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isAdmin?: boolean;

  @ApiProperty({ example: true, required: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  fullName?: string;

  @ApiProperty({ example: '+998901234567', required: false })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(/^\+?[1-9]\d{7,14}$/)
  phoneNumber?: string;

  @ApiProperty({ example: '123456', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class GetUserDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;

  @ApiProperty({ example: '+998901234567', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;
}
