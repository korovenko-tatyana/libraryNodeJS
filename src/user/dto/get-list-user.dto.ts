import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Validate } from "class-validator";
import { FromValidation } from "../../pipes/customValidations/from.validtion";
import { LimitValidation } from "../../pipes/customValidations/limit.validation";

export class GetListUserDto {
    @IsInt()
    @Type(() => Number)
    @Validate(FromValidation)
    @IsOptional()
    readonly from: number;

    @IsInt()
    @Type(() => Number)
    @Validate(LimitValidation)
    @IsOptional()
    readonly limit: number;
    
    @IsString({message: 'Must be string'})
    @Transform(({ value }) => {return value.trim()})
    @IsOptional()
    readonly fio: string;

    @IsString({message: 'Must be string'})
    @Transform(({ value }) => {return value.trim()})
    @IsOptional()
    readonly email: string;

    @IsString({message: 'Must be string'})
    @Transform(({ value }) => {return value.trim()})
    @IsOptional()
    readonly phone: string;

    @Transform(({ value }) => {
        if ('ROLE_ADMIN' === value.trim().toUpperCase()) {return ['ROLE_ADMIN', 'ROLE_USER']}
        else if ('ROLE_ADMIN' === value.trim().toUpperCase()) {return ['ROLE_USER']}
        else {return [value.trim().toUpperCase()]}
    })
    @IsArray()
    @IsOptional()
    readonly role: Array<string>;

    @IsBoolean({message: 'Must be true or false'})
    @Transform(({ value }) => {
        if ('true' === value.trim().toLowerCase()) {return true;}
        if ('false' === value.trim().toLowerCase()) {return false;} 
    })
    @IsOptional()
    readonly active: boolean;
}