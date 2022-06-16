import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseFilters, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { HttpExceptionFilter } from '../exceptions/filter/http-exception.filter';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ValidationPipe } from '../pipes/pipes/validation.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeStatusUserDto } from './dto/change-status-user.dto';
import { GetListUserDto } from './dto/get-list-user.dto';
import { ResponcePaginationInterceptor } from '../interceptors/responce.interceptor';
import { ResponceOneInterceptor } from '../interceptors/responce.one.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiExtraModels, ApiForbiddenResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from '@nestjs/swagger';
import { UserEntity } from '../classWithoutSomeProperty/user-entity.class';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @ApiOperation({summary: 'Create new user'})
    @ApiExtraModels(UserEntity)
    @ApiResponse({
            status: 200, 
            schema: {
                properties: {
                    success: { type: 'boolean', example: true},
                    result: { $ref: getSchemaPath(UserEntity)}
                }}
            })
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    @Post('create')
    @UseGuards(JwtAuthGuard)
    @Roles("ROLE_USER")
    @UsePipes(ValidationPipe)
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(ClassSerializerInterceptor, ResponceOneInterceptor)
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.add(createUserDto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @Roles("ROLE_ADMIN")
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(ResponceOneInterceptor)
    update(@Param('id') id: string, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @Roles("ROLE_USER")
    @UseGuards(JwtAuthGuard)
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(ClassSerializerInterceptor, ResponceOneInterceptor)
    get(@Param('id') id: string) {
        return this.userService.get(id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @Roles("ROLE_ADMIN")
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(ResponceOneInterceptor)
    delete(@Param('id') id: string) {
        return this.userService.delete(id);
    }

    @Post('change_status/:id')
    @UseGuards(JwtAuthGuard)
    @Roles("ROLE_ADMIN")
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(ClassSerializerInterceptor, ResponceOneInterceptor)
    changeStatus(@Param('id') id: string, @Body(ValidationPipe) changeStatusUserDto: ChangeStatusUserDto) {
        return this.userService.changeStatus(id, changeStatusUserDto);
    }

    @ApiOperation({summary: 'Get list of users by filter'})
    @ApiExtraModels(UserEntity)
    @ApiResponse({
            status: 200, 
            schema: {
                properties: {
                    success: { type: 'boolean', example: true },
                    result: { items: { $ref: getSchemaPath(UserEntity) } },
                    pagination: {
                        properties: {
                            totalCount: { type: 'number', example: 12 },
                            selected: { type: 'number', example: 7 }
                        }
                    }
                }}
            })
    @UseGuards(JwtAuthGuard)
    @Roles("ROLE_USER")
    @UsePipes(new ValidationPipe())
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(ClassSerializerInterceptor, ResponcePaginationInterceptor)
    @Get()
    getAll(@Query() query: GetListUserDto) {
        return this.userService.getAll(query);
    }
}
