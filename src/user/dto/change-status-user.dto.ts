import { IsBoolean, IsNotEmpty } from "class-validator";


export class ChangeStatusUserDto {
    @IsBoolean({message: 'Status must be true or false'})
    @IsNotEmpty({message: 'Must not be empty'})
    readonly active: boolean;
}