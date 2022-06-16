import { IsString, IsOptional, IsEmail, Matches, Validate } from "class-validator";
import { ChoiseValidation } from "../../pipes/customValidations/choise.validation";

export class UpdateUserDto {
    @IsString({message: 'Must be string'})
    @IsOptional()
    readonly fio: string;

    @IsString({message: 'Must be string'})
    @IsEmail({}, {message: 'Invalid email'})
    @IsOptional()
    readonly email: string;

    @IsString({message: 'Must be string'})
    @IsOptional()
    @Matches(/^( )*(\+)?(8|7){1}(\d){10}( )*$/, {message: 'Must be phone format'})
    readonly phone: string;

    @Validate(ChoiseValidation)
    @IsOptional()
    readonly role: string;
}