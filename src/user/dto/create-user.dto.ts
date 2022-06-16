import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, Validate } from "class-validator";
import { ChoiseValidation } from "../../pipes/customValidations/choise.validation";

export class CreateUserDto {
    @ApiProperty({example: 'Borr Tat S'})
    @IsString({message: 'Must be string'})
    @IsOptional()
    readonly fio: string;

    @ApiProperty({example: 'test@test.com'})
    @IsString({message: 'Must be string'})
    @IsEmail({}, {message: 'Invalid email'})
    @IsNotEmpty({message: 'Must not be empty'})
    readonly email: string;

    @ApiProperty({example: '123123123'})
    @IsString({message: 'Must be string'})
    @Length(8, 16, {message: 'Password must be from 8 to 16 symbols'})
    @IsNotEmpty({message: 'Must not be empty'})
    readonly password: string;

    @ApiProperty({example: '89993434334'})
    @IsString({message: 'Must be string'})
    @IsOptional()
    @Matches(/^( )*(8){1}(\d){10}( )*$/, {message: 'Must be phone format'})
    readonly phone: string;

    @ApiProperty({example: ['ROLE_USER']})
    @Validate(ChoiseValidation)
    @IsOptional()
    readonly role: string;
}