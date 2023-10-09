
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";


export class ParamsDto {

    @IsString()
    name: string

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === '1' || value === 'true')
    daily: boolean = true;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === '1' || value === 'true')
    weelky?: boolean;


}