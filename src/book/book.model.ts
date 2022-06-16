import { Length } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { StateEnum } from "../enums/state-enum";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", unique: false, nullable: false})
    @Length(255)
    title: string;

    @Column({type: "varchar", unique: true, nullable: false})
    @Length(20)
    articleNumber: string;

    @Column({type: "varchar", unique: false, nullable: true})
    @Length(255)
    author: string;

    @Column({type: "int", unique: false, nullable: true})
    year: number;

    @Column({type: "varchar", unique: false, nullable: true})
    @Length(2000)
    description: string;

    @Column({type: "boolean", nullable: true})
    binding: boolean;

    @Column({type: "int", unique: false, nullable: true})
    numberOfPages: number;

    @Column({type: "float", unique: false, nullable: true})
    price: number;

    @Column({type: "int", unique: false, nullable: true})
    countAll: number;

    @Column({type: "int", unique: false, nullable: true})
    countUsers: number;

    @Column({type: "int", unique: false, nullable: true})
    countStock: number;

    @Column({type: "enum", enum: StateEnum, unique: false, nullable: true})
    @Length(2000)
    state: StateEnum;

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date;

    @UpdateDateColumn({type: "timestamptz", nullable: true})
    updatedAt: Date;
}