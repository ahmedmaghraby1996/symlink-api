import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/service/service.base';
import { MultiRFP } from 'src/infrastructure/entities/multi-rfp/multi-rfp.entity';
import { Repository } from 'typeorm';
import { Offer } from 'src/infrastructure/entities/offer/offer.entity';
import { CreateOfferRequest } from './dto/create-offer.request';
import { Gateways } from 'src/core/base/gateways';
import { OfferGateway } from 'src/integration/gateways/offer.gateway';
import { RequestForProposalStatus } from 'src/infrastructure/data/enums/request-for-proposal.enum';
import { OfferFilterRequest } from './dto/offer-filter.request';
import { AcceptOfferTransaction } from './utils/accept-offer.transation';

@Injectable()
export class OffersService extends BaseService<Offer> {
  constructor(
    @Inject(OfferGateway) private offerGateway: OfferGateway,
    @Inject(AcceptOfferTransaction)
    private acceptOfferTransaction: AcceptOfferTransaction,

    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(MultiRFP)
    private multiRFPRepository: Repository<MultiRFP>,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    super(offersRepository);
  }

  async getAllOffersForProject(
    multi_RFP_id: string,
    offerFilterRequest: OfferFilterRequest,
  ) {
    const { page, limit } = offerFilterRequest;

    const skip = (page - 1) * limit;
    const [offers, count] = await this.offersRepository.findAndCount({
      skip,
      take: limit,
      where: {
        multi_RFP_id: multi_RFP_id,
      },
    });
    return { offers, count };
  }

  async addOfferToProject(createOfferRequest: CreateOfferRequest) {
    const { multi_RFP_id } = createOfferRequest;
    const new_Offer = this.offersRepository.create(createOfferRequest);
    new_Offer.user_id = this.request.user.id;

    const multiRFP = await this.multiRFPRepository.findOne({
      where: { id: multi_RFP_id },
    });
    if (!multiRFP) {
      throw new NotFoundException('This Project not found');
    }

    if (multiRFP.user_id === this.request.user.id) {
      throw new NotFoundException('You will not be able to submit an offer');
    }

    const current_offer = await this.offersRepository.findOne({
      where: {
        user_id: this.request.user.id,
        multi_RFP_id: multi_RFP_id,
      },
    });
    if (current_offer) {
      throw new BadRequestException('You have already made an offer');
    }
    const offer = await this.offersRepository.save(new_Offer);
    this.offerGateway.server.emit(
      `${Gateways.Offer.offerCreated}${multi_RFP_id}`,
      {
        action: 'ADD_NEW_OFFER',
        data: {
          offer,
        },
      },
    );
    return offer;
  }

  async acceptOffer(offer_id: string, multi_RFP_id: string) {
    return this.acceptOfferTransaction.run({offer_id,multi_RFP_id});
  }
}
