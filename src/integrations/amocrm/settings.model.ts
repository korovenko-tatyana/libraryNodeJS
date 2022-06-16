import { Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class SettingIntegrationAmoCrm {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", nullable: false})
    @Length(255)
    clientId: string;

    @Column({type: "varchar", nullable: false})
    @Length(255)
    secretKey: string;

    @Column({type: "varchar", nullable: false})
    @Length(255)
    clientUrl: string;

    @Column({type: "varchar", nullable: false})
    @Length(255)
    accessToken: string;

    @Column({type: "varchar", nullable: false})
    @Length(255)
    refreshToken: string;

    @Column({type: "int", nullable: false})
    expires: number;
}