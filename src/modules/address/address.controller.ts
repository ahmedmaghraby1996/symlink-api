import { Body, Controller, Delete, Get, Head, Header, Headers, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { DeleteResult } from 'typeorm';
import { AddressService } from './address.service';
import { CreateAddressRequest } from './dto/requests/create-address.request';
import { AddressByAccountRequest } from './dto/requests/address-by-account.request';
import { UpdateAddressRequest } from './dto/requests/update-address.request';
import { AddressResponse } from './dto/responses/address.respone';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Role } from 'src/infrastructure/data/enums/role.enum';
import { Roles } from '../authentication/guards/roles.decorator';
import { PaginatedResponse } from 'src/core/base/responses/paginated.response';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { PaginatedRequest } from 'src/core/base/requests/paginated.request';
import { Address } from 'src/infrastructure/entities/user/address.entity';
import { Router } from 'src/core/base/router';
import { I18nResponse } from 'src/core/helpers/i18n.helper';

@ApiBearerAuth()
@ApiTags(Router.Addresses.ApiTag)
@ApiHeader({ name: 'Accept-Language', required: false, description: 'Language header: en, ar' })

@Controller(Router.Addresses.Base)
export class AddressController {
    constructor(private addressService: AddressService,
        @Inject(I18nResponse) private readonly _i18nResponse: I18nResponse,) { }

    @Get('country')
    async getCountries(@Query() query: PaginatedRequest) {
        return new ActionResponse(this._i18nResponse.entity(await this.addressService.findAll(query)))
    }
    @Get('country/:id')
    async getCity(
        @Param("id") id: string,
        @Headers('Accept-Language') lang?: string
    ) {
        return new ActionResponse(this._i18nResponse.entity(await this.addressService.getCities(id, lang)))
    }

}
