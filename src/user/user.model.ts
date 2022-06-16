import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", unique: false, nullable: true})
    fio: string;

    @Column({type: "varchar", unique: true, nullable: false})
    email: string;

    @Column({type: "varchar", unique: false, nullable: false})
    password: string;

    @Column({type: "varchar", unique: true, nullable: true})
    phone: string;

    @Column({type: "boolean", default: true, nullable: false})
    active: boolean;

    @Column("varchar", {array: true , default: ["ROLE_USER"], nullable: false})
    role: Array<string>;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @UpdateDateColumn({type: "timestamptz", nullable: true})
    updatedAt: Date;

    @Column({type: "timestamptz", nullable: true})
    deativatedAt: Date;
}