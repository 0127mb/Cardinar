import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  fullName: string;

  @ApiProperty({ example: '+998901234567' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(/^\+?[1-9]\d{7,14}$/, {
    message: 'phoneNumber must be a valid international phone number',
  })
  phoneNumber: string;

  @ApiProperty({ example: '123456', minLength: 6 })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: '+998901234567' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(/^\+?[1-9]\d{7,14}$/, {
    message: 'phoneNumber must be a valid international phone number',
  })
  phoneNumber: string;

  @ApiProperty({ example: '123456', minLength: 6 })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;
}
