
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";


export class ParamsDto {

    @ApiProperty({
        description: "Name in spanish of zodiac sign request, in lowercase",
        example: "aries",
        required: true
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: "Indicate if you need the daily predicction",
        example: "1 | true",
        default: "true",
        required: false
    })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === '1' || value === 'true')
    daily: boolean = true;

    @ApiProperty({
        description: "Indicate if you need the weekly predicction",
        example: "1 | true",
        required: false
    })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === '1' || value === 'true')
    weekly?: boolean;

    @ApiProperty({
        description: "Set the languaje we want the prediction",
        example: "es|en|de",
        default: "es",
        required: false
    })
    @IsString()
    @MaxLength(2)
    @IsOptional()
    lang: string = 'es';


}