import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { OffersService } from './offers.service';
import { CreateOfferRequest } from './dto/create-offer.request';
import { OfferFilterRequest } from './dto/offer-filter.request';
import { PageMetaDto } from 'src/core/helpers/pagination/page-meta.dto';
import { PageDto } from 'src/core/helpers/pagination/page.dto';
import { Roles } from '../authentication/guards/roles.decorator';
import { Role } from 'src/infrastructure/data/enums/role.enum';
import { OfferResponse } from './dto/offer.response';
@ApiBearerAuth()
@ApiHeader({
  name: 'Accept-Language',
  required: false,
  description: 'Language header: en, ar',
})
@ApiTags('Offers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Roles(Role.CLIENT, Role.ADMIN)
  @Get(':multi_RFP_id/all-offers-for-project')
  async getAllOffersForProject(
    @Param('multi_RFP_id') multi_RFP_id: string,
    @Query()
    offerFilterRequest: OfferFilterRequest,
  ) {
    const {limit,page} = offerFilterRequest;
    const {offers,count}= await this.offersService.getAllOffersForProject(multi_RFP_id,offerFilterRequest);
    const offersDto =offers.map(item=> new OfferResponse(item));
    const pageMetaDto = new PageMetaDto(page, limit, count);

    return new PageDto(offersDto, pageMetaDto);
  }
  @Roles(Role.PROVIDER)
  @Post('add-offer-to-project')
  async addOfferToProject(@Body() createOfferRequest: CreateOfferRequest) {
    return this.offersService.addOfferToProject(createOfferRequest);
  }
  @Roles(Role.CLIENT)
  @Post(':offer_id/:multi_RFP_id/acceptOffer')
  async acceptOffer(@Param('offer_id') offer_id: string, @Param('multi_RFP_id') multi_RFP_id: string) {
    return this.offersService.acceptOffer(offer_id, multi_RFP_id);
  }

}
