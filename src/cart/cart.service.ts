import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartBooks } from '../cartbooks/cartbooks.model';
import { Connection, Repository } from 'typeorm';
import { Book } from '../book/book.model';
import { User } from '../user/user.model';
import { Cart } from './cart.model';
import { CreateCartDto } from './dto/create-cart.dto';
import { UserService } from '../user/user.service';
import { BookService } from '../book/book.service';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Book) private bookRepository: Repository<Book>,
        @InjectRepository(Cart) private cartRepository: Repository<Cart>,
        @InjectRepository(CartBooks) private cartBooksRepository: Repository<CartBooks>,
        private userService: UserService,
        private bookService: BookService,
        private connecton: Connection
    ) {}
    
    async add(createCartDto: CreateCartDto) {
        const user = await this.userService.checkNotExistUser('id', <string><unknown>createCartDto.userId);
        const book = await this.bookService.checkNotExistBook('id', <string><unknown>createCartDto.bookId);
        
        this.checkQuantity(book, createCartDto.quantity);
        
        await this.save(user, book, createCartDto.quantity);
    }

    async delete(id: number, user: User) {
        const cartBooks = await this.cartBooksRepository.findOne({ where:{ id: id}});

        if (undefined !== cartBooks) {
            this.checkYourselfCartBooks(user, cartBooks, id);

            const userForCart = await this.userService.checkNotExistUser('id', <string><unknown>cartBooks.userId);
            await this.cartBooksRepository.remove(cartBooks);
            const cart = await this.cartRepository.findOne({ where:{ userId: userForCart}, relations: ['userId', 'items']});
            
            if (0 === cart.items.length) {
                await this.cartRepository.remove(cart);
            }
        } else {
            throw new HttpException(`Cart not found`, HttpStatus.NOT_FOUND);
        }
    }

    async save(user: User, book: Book, quantity: number) {
        const queryRunner = this.connecton.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction(); 

        try {
            let cart = await this.cartRepository.findOne({ where:{ userId: user}, relations: ['userId', 'items']});
            let cartBooks = await this.cartBooksRepository.findOne({ where:{ userId: user.id, book: book}});
            
            if (undefined === cart) {
                cart = new Cart();
                cart.userId = user;
            }

            if (undefined === cartBooks) {
                cartBooks = new CartBooks();
                cartBooks.book = book;
                cartBooks.userId = user.id;
                cartBooks.quantityBook = quantity;
                cartBooks.cart = cart;
            } else {
                this.checkAlmostQuantity(cartBooks, book, quantity);
                cartBooks.quantityBook = cartBooks.quantityBook + quantity;
            }
            
            //await this.cartRepository.save(cart);
            //await this.cartBooksRepository.save(cartBooks);
            await queryRunner.manager.save(cart); 
            await queryRunner.manager.save(cartBooks);

            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    checkQuantity(book: Book, quantity: number) {
        if (book.countStock < quantity) {
            throw new HttpException(`Forbidden: books on stock are less than quantity in request`, HttpStatus.FORBIDDEN);
        }
    }

    checkAlmostQuantity(cartBooks: CartBooks, book: Book, quantity: number) {
        if (book.countStock < quantity + cartBooks.quantityBook) {
            throw new HttpException(`Forbidden: books on stock are less than almost quantity`, HttpStatus.FORBIDDEN);
        }
    }

    checkYourselfCartBooks(user: User, cartBooks: CartBooks, id: number) {
        if (false === user.role.includes('ROLE_ADMIN')) {
            if (cartBooks.userId !== user.id) {
                throw new HttpException(`Forbidden: You must be an admin or you can delete books only on your cart`, HttpStatus.FORBIDDEN);
            }
        }
    }
}
