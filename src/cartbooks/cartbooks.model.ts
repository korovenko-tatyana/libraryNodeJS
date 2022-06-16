import { Book } from "../book/book.model";
import { Cart } from "../cart/cart.model";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class CartBooks {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cart, (cart) => cart.items)
    cart: Cart;

    @ManyToOne(() => Book)
    book: Book;

    @Column({type: "int", unique: false, nullable: false})
    userId: number;

    @Column({type: "int", unique: false, nullable: false})
    quantityBook: number;
}