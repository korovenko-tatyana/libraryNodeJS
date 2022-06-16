import { Exclude } from "class-transformer";
import { StateEnum } from "../enums/state-enum";

export class BookEntity {
    id: number;

    title: string;

    articleNumber: string;

    author: string;

    @Exclude()
    year: number;

    @Exclude()
    description: string;

    @Exclude()
    binding: boolean;

    numberOfPages: number;

    @Exclude()
    price: number;

    @Exclude()
    countAll: number;

    countUsers: number;

    countStock: number;

    state: StateEnum;

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

    constructor (partial: Partial<BookEntity>) {
        Object.assign(this, partial);
    }
}