import {
  IsEmail,
  IsString,
  MinLength,
  IsPhoneNumber,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    example: '+998772980127',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isAdmin?: boolean;
  @ApiProperty({
    example: true,
  })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateUserDto {
  @ApiProperty({
    example: 1,
  })
  id: number
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    example: '+998772980127',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;
  @ApiProperty({
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
  @ApiProperty({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
export class GetUserDto {
  @ApiProperty({
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;
  @ApiProperty({
    example: 'example@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
  @ApiProperty({
    example: '+998772980127',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
  @ApiProperty({
    example: 'Jhon_rembo',
  })
  @IsOptional()
  @IsString()
  fullName?: string;
}
