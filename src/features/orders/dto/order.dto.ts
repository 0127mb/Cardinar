import {
  IsString,
  IsPhoneNumber,
  IsEmail,
  IsBoolean,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { orderStatus } from '../../../shared/enums/orderStatus.enum';
import { paymentMethod } from '../../../shared/enums/paymendMethod.enum';


export class CreateOrderItemDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  articulId: number;

  @ApiProperty({ example: 1, default: 1 })
  @IsNumber()
  quantity: number = 1;
}

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  branchId: number;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'user@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  delivery: boolean;

  @ApiProperty({ enum: paymentMethod, example: paymentMethod.cash })
  @IsEnum(paymentMethod)
  paymentMethod: paymentMethod;

  @ApiProperty({
    type: [CreateOrderItemDto],
    example: [{ productId: 1, articulId: 1, quantity: 2 }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: orderStatus, example: orderStatus.delivered })
  @IsEnum(orderStatus)
  status: orderStatus;
}
