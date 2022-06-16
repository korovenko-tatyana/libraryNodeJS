import { Body, Controller, Post, UseFilters, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles-auth.decorator';
import { HttpExceptionFilter } from '../../exceptions/filter/http-exception.filter';
import { ResponceOneInterceptor } from '../../interceptors/responce.one.interceptor';
import { ValidationPipe } from '../../pipes/pipes/validation.pipe';
import { AmocrmService } from './amocrm.service';
import { SettingIntegrationDto } from './dto/settings-integration.dto';

@ApiBearerAuth()
@ApiTags('AmoCRM')
@Controller()
export class SettingsController {
    constructor(private amocrmService: AmocrmService) {}

    @Post('authorization_amocrm')
    @UseGuards(JwtAuthGuard)
    @Roles("ROLE_USER")
    @UsePipes(ValidationPipe)
    @UseFilters(HttpExceptionFilter)
    @UseInterceptors(ResponceOneInterceptor)
    create(@Body() settingsIntDto: SettingIntegrationDto) {
        return this.amocrmService.authAmoCrm(settingsIntDto);
    }
}
