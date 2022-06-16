import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from '../classWithoutSomeProperty/book-entity.class';
import { Repository } from 'typeorm';
import { Book } from './book.model';
import { CreateBookDto } from './dto/create-book.dto';
import { GetListBookDto } from './dto/get-list-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
    constructor(@InjectRepository(Book) private bookRepository: Repository<Book>) {}
    
    async add(createBookDto: CreateBookDto) {
        await this.checkExistArticle(createBookDto);

        const book = await this.save(createBookDto);

        //return this.getNecessaryParams(book);
        return new BookEntity(book);
    }

    async update(id: string, updateBookDto: UpdateBookDto) {
        const book = await this.checkNotExistBook('id', id);
        
        if (book.articleNumber !== updateBookDto.articleNumber) {
            await this.checkAlreadyExistBook('articleNumber', updateBookDto.articleNumber);
        }

        return new BookEntity(await this.editBook(book, updateBookDto));
    }

    async get(id: string) {
        const book =  await this.checkNotExistBook('id', id);

        //return this.getNecessaryParams(book);
        return new BookEntity(book);
    }

    async delete(id: string) {
        const book = await this.checkNotExistBook('id', id);

        await this.bookRepository.remove(book);
    }

    async getAll(getListBookDto: GetListBookDto) {
        const [list, totalCount] = await this.findAllBooks(getListBookDto);
        const pagination = {
            totalCount: totalCount,
            selected: list.length,
            from: getListBookDto.from
        }

        const result = this.changeElementsOfArray(list);

        return [result, pagination];
    }

    async findAllBooks(getListBookDto: GetListBookDto) {
        const qr = this.bookRepository
        .createQueryBuilder('book')
        .take(getListBookDto.limit)
        .skip(getListBookDto.from)
        
        const arrKey = ['title', 'articleNumber', 'author'];
        
        for (let key in getListBookDto) {
            if (true === arrKey.includes(key)) {
                if ('' === getListBookDto[key]) {
                    qr.andWhere(`book.${key} IS NULL`)
                } else if(undefined !== getListBookDto[key]) {
                    qr.andWhere(`lower(book.${key}) like :${key}`)
                    .setParameter(`${key}`, `%${getListBookDto[key].toLowerCase()}%`)
                }
            } 
        }

        if (undefined !== getListBookDto.year && getListBookDto.year) {
            qr.andWhere('book.year = :year', {year: getListBookDto.year})
        }

        if (undefined !== getListBookDto.state) {
            qr.andWhere('book.state = :state', {state: getListBookDto.state})
        }

        return qr.getManyAndCount();
    }

    async checkExistArticle(createBookDto: CreateBookDto) {
        await this.checkAlreadyExistBook('articleNumber', createBookDto.articleNumber);
    }

    async checkAlreadyExistBook(nameOfField: string, param: string) {
        const findBook = await this.findByParam(nameOfField, param);

        if (undefined !== findBook) {
            throw new HttpException(`Book with ${nameOfField} ${param} already exist`, HttpStatus.BAD_REQUEST);
        }
    }

    async checkNotExistBook(nameOfField: string, param: string) {
        const findBook = await this.findByParam(nameOfField, param);

        if (undefined === findBook) {
            throw new HttpException(`Book with ${nameOfField} ${param} not found`, HttpStatus.NOT_FOUND);
        } else {
            return findBook;
        }
    }

    async findByParam(nameOfField: string, param: string) {
        return await this.bookRepository
        .createQueryBuilder('book')
        .where(`book.${nameOfField} = :param`, {param: param})
        .getOne()
    }

    async save(createBookDto: CreateBookDto) {
        const book = new Book();

        book.title = createBookDto.title;
        book.articleNumber = createBookDto.articleNumber;
        book.author = createBookDto.author;
        book.year = createBookDto.year;
        book.description = createBookDto.description;
        book.binding = createBookDto.binding;
        book.numberOfPages = createBookDto.numberOfPages;
        book.price = createBookDto.price;
        book.countAll = createBookDto.countAll;
        book.state = createBookDto.state;

        book.countStock = createBookDto.countAll;
        book.updatedAt = null;

        if (undefined === createBookDto.countAll) {
            book.countUsers = createBookDto.countAll;
        } else {
            book.countUsers = 0;
        }
        
        return await this.bookRepository.save(book);
    }

    async editBook(book: Book, updateBookDto: UpdateBookDto) {
        console.log(updateBookDto);
        book.title = updateBookDto.title ?? book.title;
        book.articleNumber = updateBookDto.articleNumber ?? book.articleNumber;
        book.author = updateBookDto.author ?? book.author;
        book.year = updateBookDto.year ?? book.year;
        book.description = updateBookDto.description ?? book.description;
        book.binding = updateBookDto.binding ?? book.binding;
        book.numberOfPages = updateBookDto.numberOfPages ?? book.numberOfPages;
        book.price = updateBookDto.price ?? book.price;
        book.state = updateBookDto.state ?? book.state;
        
        if (undefined !== updateBookDto.countStock) {
            book.countStock = updateBookDto.countStock;

            if (undefined === book.countUsers || null === book.countUsers) {
                book.countUsers = 0;
            }

            book.countAll = book.countUsers + updateBookDto.countStock;
        }

        return await this.bookRepository.save(book);
    }

    getNecessaryParams(book: Book) {
        const {year, createdAt, updatedAt, countAll, price, binding, description, ...result} = book;

        return result;
    }

    changeElementsOfArray(books: Book[]) {
        const result = [];

        for(let key in books) {
            //result[key] = this.getNecessaryParams(books[key]);
            result[key] = new BookEntity(books[key]);
        }

        return result;
    }
}
