import { Controller, Get, Post, Request, UseFilters, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../exceptions/filter/http-exception.filter';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Auth')
@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @UseFilters(HttpExceptionFilter)
    @Post('login')
    login(@Request() req) {
        return this.authService.login(req.user);
    }
}
