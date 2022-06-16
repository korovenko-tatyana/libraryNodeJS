import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseFilters, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { HttpExceptionFilter } from '../exceptions/filter/http-exception.filter';
import { ResponceOneInterceptor } from '../interceptors/responce.one.interceptor';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { ValidationPipe } from '../pipes/pipes/validation.pipe';
import { UpdateBookDto } from './dto/update-book.dto';
import { ResponcePaginationInterceptor } from '../interceptors/responce.interceptor';
import { GetListBookDto } from './dto/get-list-book.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Books')
@Controller('book')
export class BookController {
    constructor(private bookService: BookService) {}

    @Post('create')
    @UseGuards(JwtAuthGuard)
    @Roles("ROLE_ADMIN")
    @UsePipes(ValidationPipe)
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(ClassSerializerInterceptor, ResponceOneInterceptor)
    create(@Body() createBookDto: CreateBookDto) {
        return this.bookService.add(createBookDto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @Roles("ROLE_ADMIN")
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(ClassSerializerInterceptor, ResponceOneInterceptor)
    update(@Param('id') id: string, @Body(ValidationPipe) updateBookDto: UpdateBookDto) {
        return this.bookService.update(id, updateBookDto);
    }
    
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @Roles("ROLE_USER")
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(ClassSerializerInterceptor, ResponceOneInterceptor)
    get(@Param('id') id: string) {
        return this.bookService.get(id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @Roles("ROLE_ADMIN")
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(ResponceOneInterceptor)
    delete(@Param('id') id: string) {
        return this.bookService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @Roles("ROLE_USER")
    @UsePipes(new ValidationPipe())
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(ClassSerializerInterceptor, ResponcePaginationInterceptor)
    @Get()
    getAll(@Query() query: GetListBookDto) {
        return this.bookService.getAll(query);
    }
}
