import { Body, Controller, Request, Delete, Param, Post, UseFilters, UseGuards, UseInterceptors, UsePipes, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../pipes/pipes/validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { HttpExceptionFilter } from '../exceptions/filter/http-exception.filter';
import { ResponceOneInterceptor } from '../interceptors/responce.one.interceptor';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';

@ApiBearerAuth()
@ApiTags('Cart')
@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @Post('create')
    @UseGuards(JwtAuthGuard)
    @Roles("ROLE_USER")
    @UsePipes(ValidationPipe)
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(ResponceOneInterceptor)
    create(@Body() createCartDto: CreateCartDto) {
        return this.cartService.add(createCartDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @Roles("ROLE_USER")
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(ResponceOneInterceptor)
    delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.cartService.delete(id, req.user);
    }
}
