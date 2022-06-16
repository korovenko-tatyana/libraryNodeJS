import { CartBooks } from "../cartbooks/cartbooks.model";
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.model";


@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    userId: User;

    @OneToMany(() => CartBooks, (items) => items.cart)
    items: CartBooks[];
}