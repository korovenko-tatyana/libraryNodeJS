import { Transform, Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Validate } from "class-validator";
import { FromValidation } from "../../pipes/customValidations/from.validtion";
import { LimitValidation } from "../../pipes/customValidations/limit.validation";
import { StateValidation } from "../../pipes/customValidations/state.validation";
import { YearValidatotion } from "../../pipes/customValidations/year.validate";
import { StateEnum } from "../../enums/state-enum";

export class GetListBookDto {
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
    readonly title: string;

    @IsString({message: 'Must be string'})
    @Transform(({ value }) => {return value.trim()})
    @IsOptional()
    readonly articleNumber: string;

    @IsString({message: 'Must be string'})
    @Transform(({ value }) => {return value.trim()})
    @IsOptional()
    readonly author: string;

    @IsInt()
    @Type(() => Number)
    @Validate(YearValidatotion)
    @IsOptional()
    readonly year: number;

    @IsString({message: 'Must be string'})
    @Transform(({ value }) => {
        if (value.toUpperCase() in StateEnum) {
            return StateEnum[value.toUpperCase()];
        }
        return value;
    })
    @Validate(StateValidation)
    @IsOptional()
    readonly state: StateEnum;
}