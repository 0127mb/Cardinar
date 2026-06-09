import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { TranslationStaticInfoDto } from './translation-static-info.dto';

export class CreateStaticInfoDTO {
    @ApiProperty({ example: '123 Main St, Anytown, USA' })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ example: '+1 (555) 123-4567' })
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty({ example: 'Mon-Fri 9AM-5PM' })
    @IsString()
    @IsNotEmpty()
    workingHours: string;

    @ApiProperty({ example: 'info@company.com' })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        type: [TranslationStaticInfoDto],
        required: false,
        description: 'Optional static info translations for header, sub navbar and address',
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TranslationStaticInfoDto)
    translations?: TranslationStaticInfoDto[];
}
