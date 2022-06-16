import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { StateEnum } from "../../enums/state-enum";
import { StateValidation } from "../../pipes/customValidations/state.validation";

export class CreateBookDto {
    @ApiProperty({example: 'Tom S.'})
    @IsString({message: 'Must be string'})
    @IsNotEmpty({message: 'Must not be empty'})
    readonly title: string;

    @ApiProperty({example: 'BB-1401'})
    @IsString({message: 'Must be string'})
    @IsNotEmpty({message: 'Must not be empty'})
    readonly articleNumber: string;

    @ApiProperty({example: 'Mark T.'})
    @IsString({message: 'Must be string'})
    @IsOptional()
    readonly author: string;

    @ApiProperty({example: 1998})
    @IsNumber()
    @IsOptional()
    readonly year: number;

    @ApiProperty({example: 'Small story about ...'})
    @IsString({message: 'Must be string'})
    @IsOptional()
    readonly description: string;

    @ApiProperty({example: true})
    @IsBoolean({message: 'Must be true or false'})
    @IsOptional()
    readonly binding: boolean;

    @ApiProperty({example: 556})
    @IsNumber()
    @IsOptional()
    readonly numberOfPages: number;

    @ApiProperty({example: 734.7})
    @IsNumber()
    @IsOptional()
    readonly price: number;

    @ApiProperty({example: 17})
    @IsNumber()
    @IsOptional()
    readonly countAll: number;

    @ApiProperty({enum: ['new', 'relic', 'medium', 'bad']})
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
