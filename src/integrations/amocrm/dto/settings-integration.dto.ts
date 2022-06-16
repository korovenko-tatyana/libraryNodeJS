import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class SettingIntegrationDto {
    @IsString({message: 'Must be string'})
    @IsNotEmpty({message: 'Must not be empty'})
    readonly clientId: string;

    @IsString({message: 'Must be string'})
    @IsNotEmpty({message: 'Must not be empty'})
    readonly secretKey: string;

    @IsString({message: 'Must be string'})
    @IsNotEmpty({message: 'Must not be empty'})
    @Transform(({ value }) => {
        if (value.includes('https://')) {
            return value.trim().slice(8);
        }

        if (value.includes('http://')) {
            return value.trim().slice(7);
        }

        return value;
    })
    @Matches(/^[A-z0-9\-]+.amocrm.ru$/, {message: 'Invalid url client'})
    readonly clientUrl: string;

    @IsString({message: 'Must be string'})
    @IsNotEmpty({message: 'Must not be empty'})
    readonly code: string;

    @IsString({message: 'Must be string'})
    readonly redirectUri: string = 'https://google.com';
}