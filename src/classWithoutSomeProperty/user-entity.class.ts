import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export class UserEntity {
    @ApiProperty({example: 1})
    id: number;

    @ApiProperty({example: 'Borr Tat S'})
    fio: string;

    @ApiProperty({example: 'test@test.com'})
    email: string;

    @Exclude()
    password: string;

    @ApiProperty({example: '89993434334'})
    phone: string;

    @ApiProperty({example: true})
    active: boolean;

    @ApiProperty({example: ['ROLE_USER']})
    role: Array<string>;

    @ApiProperty({example: '2022-05-31T08:52:42.728Z'})
    createdAt: Date;

    @ApiProperty({example: '2022-05-31T08:52:42.728Z'})
    updatedAt: Date;

    @ApiProperty({example: '2022-05-31T08:52:42.728Z'})
    deativatedAt: Date;

    constructor (partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}