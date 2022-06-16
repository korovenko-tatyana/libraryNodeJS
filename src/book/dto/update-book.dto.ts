import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { StateValidation } from "../../pipes/customValidations/state.validation";
import { StateEnum } from "../../enums/state-enum";

export class UpdateBookDto {
    @IsString({message: 'Must be string'})
    @IsOptional()
    readonly title: string;

    @IsString({message: 'Must be string'})
    @IsOptional()
    readonly articleNumber: string;

    @IsString({message: 'Must be string'})
    @IsOptional()
    readonly author: string;

    @IsNumber()
    @IsOptional()
    readonly year: number;

    @IsString({message: 'Must be string'})
    @IsOptional()
    readonly description: string;

    @IsBoolean({message: 'Must be true or false'})
    @IsOptional()
    readonly binding: boolean;

    @IsNumber()
    @IsOptional()
    readonly numberOfPages: number;

    @IsNumber()
    @IsOptional()
    readonly price: number;

    @IsNumber()
    @IsOptional()
    readonly countStock: number;

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
