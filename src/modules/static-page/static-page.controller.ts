import {
    Body,
    Controller, Get, Param, Patch, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Role } from 'src/infrastructure/data/enums/role.enum';
import { Roles } from '../authentication/guards/roles.decorator';
import { StaticPageService } from './static-page.service';
import { I18nResponse } from 'src/core/helpers/i18n.helper';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { plainToInstance } from 'class-transformer';
import { UpdateStaticPageRequest } from './dto/request/update-static-page.request';
import { GetStaticPage } from './dto/request/get-static-page.request';
import { StaticPage } from 'src/infrastructure/entities/static-pages/statis-page.entity';
import { StaticPageResponse } from './response/static-page.response';


@ApiBearerAuth()
@ApiHeader({
    name: 'Accept-Language',
    required: false,
    description: 'Language header: en, ar',
})
@ApiTags('Satic Page')
@Controller('static-page')
export class StaticPageController {
    constructor(
        private readonly staticPageService: StaticPageService,
        private readonly _i18nResponse: I18nResponse,
    ) { }

    @Patch()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async updateStaticPage(@Body() req: UpdateStaticPageRequest): Promise<ActionResponse<StaticPage>> {
        const result = await this.staticPageService.updateStaticPageByType(req);
        return new ActionResponse<StaticPage>(result);
    }

    @Get("/:static_page_type")
    async getStaticPage(@Param() param: GetStaticPage): Promise<ActionResponse<StaticPageResponse>> {
        let staticPage = await this.staticPageService.getStaticPageByType(param.static_page_type);
        staticPage = this._i18nResponse.entity(staticPage)
        
        const result = plainToInstance(StaticPageResponse, staticPage, {
            excludeExtraneousValues: true
        });
        return new ActionResponse<StaticPageResponse>(result);
    }
}